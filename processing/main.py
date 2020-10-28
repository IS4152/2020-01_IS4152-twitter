from os import path, makedirs
import datetime
import logging
import json
import pandas as pd
import numpy as np
from topic import topic_model

# logging.basicConfig(
#     format='%(asctime)s %(levelname)-8s %(message)s',
#     level=logging.INFO,
#     datefmt='%Y-%m-%d %H:%M:%S')
logger = logging.getLogger('mylogger')
logger.setLevel(logging.DEBUG)
# create file handler which logs even debug messages
fh = logging.FileHandler('processing.log')
fh.setLevel(logging.INFO)
# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
fh.setFormatter(formatter)
logger.addHandler(fh)

# for topics probabilities returning float32
# src https://stackoverflow.com/a/49677241/4858751
class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def main():
    data_dir = '/mnt/d/Development/IS4152-twitter/data'
    output_dir = '/mnt/d/Development/IS4152-twitter/output'
    output_path = '/mnt/d/Development/IS4152-twitter/output/processed.json'
    # today = datetime.date.today().isoformat()
    today = '2020-10-18'
    output_today_dir = path.join(output_dir, today)
    makedirs(output_today_dir, exist_ok=True)
    csv_file = path.join(data_dir, today + '.csv')

    df = pd.read_csv(csv_file)

    tweets = df['text'].values.tolist()
    topics_word_freq = topic_model(tweets, output_today_dir)
    output_json = []
    try:
        with open(output_path, 'r') as output_file:
            output_json = json.load(output_file)
    except Exception as e:
        logger.error(e)
    # find today's output if any
    output_today = next((item for item in output_json if item['date'] == today), None)
    if not output_today:
        output_today = { 'date': today }
        output_json.append(output_today)
    output_today['topics'] = topics_word_freq # stringify numpy float32
    try:
        with open(output_path, 'w') as output_file:
            # update output json
            json.dump(output_json, output_file, cls=NumpyEncoder)
    except Exception as e:
        logger.error(e)

if __name__ == '__main__':
    main()