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
import numpy as np
import json
stop_words = set(stopwords.words('english')) 

def process_tweets(texts):
    processed = []
    for text in texts:
        #stripping the common stop letters
        text = re.sub(r'\@\w+|\#|\n|]b','', text)
        text = text.translate(str.maketrans('', '', string.punctuation))
        text = re.sub('([A-Z][a-z]+)', r' \1', text) #separattion of camelCase words to get more word tokens
        text_tokens = word_tokenize(text)
        filtered_words = [w for w in text_tokens if not w in stop_words] #removing of common stopwords
        processed.append(" ".join(filtered_words))
    return processed



def score_tweets(df):
    sa = SentimentIntensityAnalyzer()
    scores=[]
    for i in range(df.shape[0]):
        scores.append(sa.polarity_scores(df.iloc[i]['tweets']))
    df['polarity_scores'] = scores
    return df

def separate_scores(df):
    df['compounded'] = df['polarity_scores'].apply(lambda x: x['compound'])
    df['neutral'] = df['polarity_scores'].apply(lambda x: x['neu'])
    df['positive'] = df['polarity_scores'].apply(lambda x: x['pos'])
    df['negative'] = df['polarity_scores'].apply(lambda x: x['neg'])
    return df

def label_candidates(df):
    biden_count = df['text'].str.lower().str.count('biden')
    trump_count = df['text'].str.lower().str.count('trump')
    # set dataframe column conditionally based on series, src: https://stackoverflow.com/a/19913845/4858751
    conditions = [
        biden_count > trump_count,
        trump_count > biden_count
    ]
    choices = ['Biden', 'Trump']
    df['candidate'] = np.select(conditions, choices, default='NA')
    print(df['candidate'].head())
    return df
