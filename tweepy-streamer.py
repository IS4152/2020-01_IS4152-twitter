import tweepy
import json
import os
import csv
import datetime

auth = tweepy.OAuthHandler(os.environ['CONSUMER_KEY'], os.environ['CONSUMER_SECRET'])
auth.set_access_token(os.environ['ACCESS_TOKEN'], os.environ['ACCESS_TOKEN_SECRET'])
api = tweepy.API(auth, wait_on_rate_limit=True)
csv_file = open(datetime.date.today().isoformat() + '.csv', 'a')
csv_writer = csv.writer(csv_file, delimiter=',')
csv_writer.writerow(['tweet_id', 'text', 'created_at', 'timestamp_ms', 'user_id', 'user_name', 'user_location', 'geo', 'coordinates', 'place_full_name', 'place_country', 'retweeted_status_id'])

class MyStreamListener(tweepy.StreamListener):
    def on_status(self, status):
        print(status.id)
        # with open('tweets.json', 'a') as file:
        #     file.write(json.dumps(status._json) + '\n')
        s = status
        row = [s.id, s.text, s.created_at, s.timestamp_ms, s.user.id, s.user.name, s.user.location, s.geo, s.coordinates, s.place.full_name if s.place else None, s.place.country if s.place else None, s.retweeted_status.id if hasattr(s, 'retweeted_status') else None]
        csv_writer.writerow(row)
        csv_file.flush()
        return True

myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener)
print(myStream)
#user_keyword=input("#Trump")
myStream.filter(track=['#Trump','#biden'],locations=[-74.1687,40.5722,-73.8062,40.9467])
