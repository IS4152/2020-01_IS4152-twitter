import os
import tweepy as tw
import pandas as pd
import csv
from dotenv import load_dotenv
load_dotenv()

consumer_key = os.getenv("CONSUMER_KEY")
consumer_secret = os.getenv('CONSUMER_KEY_SECRET')
access_token = os.getenv('ACCESS_TOKEN')
access_token_secret = os.getenv('ACCESS_TOKEN_SECRET')

#instantiating the twitter api
auth = tw.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tw.API(auth, wait_on_rate_limit=True)

# insertion of search words and the 
search_words = "#Debate2020"
date_since = "2019-11-16"

with open('tweets_trump_test.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=',')
    tweets = tw.Cursor(api.search,
        q=search_words,
        lang="en",
        since=date_since).items(20)

        # Iterate and print tweets
    res = []
        # Iterate and print tweets
    for tweet in tweets:
        tmp = []
        tmp.append(tweet.created_at)
        tmp.append(tweet.text.encode(sys.stdout.encoding, errors='replace'))
        tmp.append(tweet.source)
        tmp.append(tweet.id_str)
        tmp.append(tweet.user.name.encode(sys.stdout.encoding, errors='replace'))
        tmp.append(tweet.user.description.encode(sys.stdout.encoding, errors='replace'))
        tmp.append(tweet.user.location.encode(sys.stdout.encoding, errors='replace'))
        res.append(tmp)
    for row in res:
        #getting the raw form of the tweets
        spamwriter.writerow(row)
                                
                                                
