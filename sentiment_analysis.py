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
class sentiment_analysis():
    
    def __init__(self,csv):
        self.csv = csv
        self.df = pd.read_csv(csv)

    def process_tweets(self,text):
        #stripping the common stop letters
        text = re.sub(r'\@\w+|\#|\n|]b','', text)
        text = text.translate(str.maketrans('', '', string.punctuation))
        text = re.sub('([A-Z][a-z]+)', r' \1', text) #separattion of camelCase words to get more word tokens
        text_tokens = word_tokenize(text)
        filtered_words = [w for w in text_tokens if not w in stop_words] #removing of common stopwords
        return " ".join(filtered_words)


    def add_processed(self):
        processed = []
        for i in range(self.df.shape[0]):
            processed.append(self.process_tweets(self.df.loc[i,'text']))
        self.df['processed_tweets'] = processed


    def score_tweets(self):
        sa = SentimentIntensityAnalyzer()
        scores=[]
        for i in range(self.df.shape[0]):
            scores.append(sa.polarity_scores(self.df['processed_tweets'][i]))
        self.df['polarity_scores'] = scores

    def separate_scores(self):
        self.df['compounded'] = self.df['polarity_scores'].apply(lambda x: x['compound'])
        self.df['neutral'] = self.df['polarity_scores'].apply(lambda x: x['neu'])
        self.df['positive'] = self.df['polarity_scores'].apply(lambda x: x['pos'])
        self.df['negative'] = self.df['polarity_scores'].apply(lambda x: x['neg'])

    def label_candidates(self):
        match = ['trump','#trump','rep','republican']
        self.df['candidate'] = 'NA'
        for i in range(self.df.shape[0]):
            if any(x in self.df.loc[i,'text'].lower() for x in match):
                self.df.loc[i,'candidate'] = 'Trump'
            else: 
                self.df.loc[i,'candidate'] = 'Biden'

a = sentiment_analysis('data/2020-10-18.csv')
a.add_processed()
a.score_tweets()
a.separate_scores()
a.label_candidates()
print(a.df.columns)
import datetime


#a.df['timestamp_ms'] = [datetime.datetime.fromtimestamp(x).strftime('%Y-%m-%d %H:%M:%S.%f') for x in a.df['timestamp_ms']]
biden = a.df[a.df['candidate']=='Biden']
trump = a.df[a.df['candidate']=='Trump']
biden.to_json('data/output/biden_1810.json')
biden.to_csv('data/output/biden_1810.csv')
trump.to_json('data/output/trump_1810.json')
trump.to_csv('data/output/trump_1810.csv')
