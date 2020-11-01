from os import path, makedirs
import datetime
import logging
import json
import pandas as pd
import numpy as np
from topic import topic_model
from sentiment_analysis import process_tweets, score_tweets, separate_scores, label_candidates

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

def process_tweets(df,text):
    #stripping the common stop letters
    text = re.sub(r'\@\w+|\#|\n|]b','', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub('([A-Z][a-z]+)', r' \1', text) #separattion of camelCase words to get more word tokens
    text_tokens = word_tokenize(text)
    filtered_words = [w for w in text_tokens if not w in stop_words] #removing of common stopwords
    return " ".join(filtered_words)


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

    #remove sarcastic tweets
    df = df[df['sarcasm_value']<0] #takes value less than 0 which are non-saracastic tweets

    #process the tweets
    processed = []
    for i in range(df.shape[0]):
        processed.append(process_tweets(df.loc[i,'text']))
    df['processed_tweets'] = processed

    df = score_tweets(df)
    df = separate_scores(df)
    df = label_candidates(df)

    #creating individual df
    trump_df = df[df['candidate']=='Trump']
    biden_df = df[df['candidate']=='Biden']

    trump_df['created_at_hr'] = pd.to_datetime(trump_df['created_at'])
    trump_df['created_at_hr'] = trump_df['created_at_hr'].apply(lambda x:x.replace(minute=0,second=0) )
    trump_df_grp = trump_df.groupby(trump_df['created_at_hr']).mean()
    trump_df_grp = trump_df_grp.reset_index()
    trump_df_grp = trump_df_grp[['created_at_hr','sarcasm_value','compounded','neutral','positive','negative']]


    biden_df['created_at_hr'] = pd.to_datetime(biden_df['created_at'])
    biden_df['created_at_hr'] = biden_df['created_at_hr'].apply(lambda x:x.replace(minute=0,second=0) )
    biden_df_grp = biden_df.groupby(biden_df['created_at_hr']).mean()
    biden_df_grp = biden_df_grp.reset_index()
    biden_df_grp = biden_df_grp[['created_at_hr','sarcasm_value','compounded','neutral','positive','negative']]


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