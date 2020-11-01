import nltk
import re
import string
from datetime import datetime
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pandas as pd
import json
stop_words = set(stopwords.words('english')) 

def process_tweets(text):
    #stripping the common stop letters
    text = re.sub(r'\@\w+|\#|\n|]b','', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub('([A-Z][a-z]+)', r' \1', text) #separattion of camelCase words to get more word tokens
    text_tokens = word_tokenize(text)
    filtered_words = [w for w in text_tokens if not w in stop_words] #removing of common stopwords
    return " ".join(filtered_words)



def score_tweets(df):
    sa = SentimentIntensityAnalyzer()
    scores=[]
    for i in range(df.shape[0]):
        scores.append(sa.polarity_scores(df.iloc[i]['processed_tweets']))
    df['polarity_scores'] = scores
    return df

def separate_scores(df):
    df['compounded'] = df['polarity_scores'].apply(lambda x: x['compound'])
    df['neutral'] = df['polarity_scores'].apply(lambda x: x['neu'])
    df['positive'] = df['polarity_scores'].apply(lambda x: x['pos'])
    df['negative'] = df['polarity_scores'].apply(lambda x: x['neg'])
    return df

def label_candidates(df):
    match = ['trump','#trump','rep','republican']
    df['candidate'] = 'NA'
    for i in range(df.shape[0]):
        if any(x in df.iloc[i]['text'].lower() for x in match):
            df.loc[i,'candidate'] = 'Trump'
        else: 
            df.loc[i,'candidate'] = 'Biden'
    return df
df = pd.read_csv('../data/2020-10-21.csv')

df = df[df['sarcasm_value']<0] #takes value less than 0 which are non-saracastic tweets

#process the tweets
processed = []
for text in df['text']:
    processed.append(process_tweets(text))
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
trump_df_grp.to_csv('../data/output/trump_0111.csv')
biden_df_grp.to_csv('../data/output/biden_0111.csv')