import sentiment_analysis
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
def process_csv(path_to_csv):
    a = sentiment_analysis('data/2020-10-16.csv') #replace with path when done
    a.add_processed()
    a.score_tweets()
    a.separate_scores()
    a.label_candidates()
    print(a.df.columns)
    a.df['timestamp'] = datetime.fromtimestamp(a.df['timestamp'])
    a.df.to_json('test.json')
    a.df.to_csv('output.csv')