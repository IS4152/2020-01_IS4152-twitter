from os import path, makedirs, environ
from datetime import datetime, date, timedelta
import logging
import json
import pandas as pd
import numpy as np
from topic import topic_model
from sentiment_analysis import process_tweets, score_tweets, separate_scores, label_candidates
from correlation import correlation

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
    print('start ' + datetime.now().isoformat())
    logger.info('start ' + datetime.now().isoformat())
    data_dir = environ.get('DATA_DIR', '/home/dc/IS4152-twitter/data')
    output_dir = environ.get('OUTPUT_DIR', '/home/dc/IS4152-twitter/output')
    output_processed_path = path.join(output_dir, 'processed.json')
    output_correlation_path = path.join(output_dir, 'correlation.json')
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    # yesterday = '2020-10-24'
    print('processing ' + yesterday)
    logger.info('processing ' + yesterday)
    output_yesterday_dir = path.join(output_dir, yesterday)
    makedirs(output_yesterday_dir, exist_ok=True)
    csv_file = path.join(data_dir, yesterday + '.csv')

    df = pd.read_csv(csv_file, usecols=['text', 'sarcasm_value', 'created_at'])

    #remove sarcastic tweets
    df = df[df['sarcasm_value'] != 'error']
    df['sarcasm_value'] = pd.to_numeric(df['sarcasm_value'])
    df = df[df['sarcasm_value'] < 0] #takes value less than 0 which are non-saracastic tweets

    tweets = df['text'].values.tolist()
    topics_word_freq = topic_model(tweets, output_yesterday_dir)
    output_json = []

    #process the tweets
    processed = process_tweets(tweets)
    df['processed_text'] = processed

    df = score_tweets(df)
    df = separate_scores(df)
    df = label_candidates(df)

    random_tweets = df.sample(10).replace({np.nan: None}).to_dict('records')

    #creating individual df
    trump_df = df[df['candidate']=='Trump']
    biden_df = df[df['candidate']=='Biden']

    trump_df['created_at_hr'] = pd.to_datetime(trump_df['created_at'])
    trump_df['created_at_hr'] = trump_df['created_at_hr'].apply(lambda x:x.replace(minute=0,second=0) )
    trump_df_grp = trump_df.groupby(trump_df['created_at_hr']).mean()
    trump_df_grp = trump_df_grp.reset_index()
    trump_df_grp = trump_df_grp[['created_at_hr','sarcasm_value','compounded','neutral','positive','negative']]
    trump_df_grp['hour'] = [t.hour for t in trump_df_grp['created_at_hr']]
    trump_df_list = trump_df_grp.to_dict('records')


    biden_df['created_at_hr'] = pd.to_datetime(biden_df['created_at'])
    biden_df['created_at_hr'] = biden_df['created_at_hr'].apply(lambda x:x.replace(minute=0,second=0) )
    biden_df_grp = biden_df.groupby(biden_df['created_at_hr']).mean()
    biden_df_grp = biden_df_grp.reset_index()
    biden_df_grp = biden_df_grp[['created_at_hr','sarcasm_value','compounded','neutral','positive','negative']]
    biden_df_grp['hour'] = [t.hour for t in biden_df_grp['created_at_hr']]
    biden_df_list = biden_df_grp.to_dict('records')

    sentiment = []
    for hour in range(24):
        biden_hour = next((item for item in biden_df_list if item.get('hour') == hour), {})
        trump_hour = next((item for item in trump_df_list if item.get('hour') == hour), {})
        biden_hour.pop('hour', None)
        biden_hour.pop('created_at_hr', None)
        trump_hour.pop('hour', None)
        trump_hour.pop('created_at_hr', None)
        combined = { 'hour': hour, 'biden': biden_hour, 'trump': trump_hour }
        sentiment.append(combined)

    try:
        with open(output_processed_path, 'r') as output_file:
            output_json = json.load(output_file)
    except Exception as e:
        logger.error(e)
    # find yesterday's output if any
    output_yesterday = next((item for item in output_json if item['date'] == yesterday), None)
    if not output_yesterday:
        output_yesterday = { 'date': yesterday }
        output_json.append(output_yesterday)
    output_yesterday['topics'] = topics_word_freq # stringify numpy float32
    output_yesterday['sentiments'] = sentiment
    output_yesterday['tweets'] = random_tweets
    output_json.sort(key=lambda x: x['date'])
    try:
        with open(output_processed_path, 'w') as output_file:
            # update output json
            json.dump(output_json, output_file, cls=NumpyEncoder, separators=(',', ':'))
    except Exception as e:
        logger.error(e)
    # run correlation script after saving processed json
    correlation_result = correlation(output_processed_path)
    with open(output_correlation_path, 'w') as output_file:
        json.dump(correlation_result, output_file, separators=(',', ':'))

    logger.info('end ' + datetime.now().isoformat())

if __name__ == '__main__':
    try:
        # for date in ['2020-10-19', '2020-10-20', '2020-10-21', '2020-10-22', '2020-10-23', '2020-10-24', '2020-10-25', '2020-10-26', '2020-10-27', '2020-10-28', '2020-10-29', '2020-10-30', '2020-10-31', '2020-11-01', '2020-11-02', '2020-11-03', '2020-11-04']:
        #     main(date)
        main()
    except Exception as e:
        logger.error('GLOBAL EXCEPTION')
        logger.error(e)
