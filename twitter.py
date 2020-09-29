import os
import tweepy as tw
import pandas as pd
import csv
from dotenv import load_dotenv
load_dotenv()

consumer_key = os.getenv("CONSUMER_KEY")
consumer_key_secret = os.getenv('CONSUMER_KEY_SECRET')
access_token = os.getenv('ACCESS_TOKEN')
access_token_secret = os.getenv('ACCESS_TOKEN_SECRET')

print(consumer_key)
print(access_token)

with open('tweets_trump.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=' ',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)