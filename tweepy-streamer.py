import tweepy
import json
import os
import csv
import datetime
import re
import urllib.parse
import urllib.request
import json

auth = tweepy.OAuthHandler(os.getenv('CONSUMER_KEY'), os.getenv('CONSUMER_SECRET'))
auth.set_access_token(os.getenv('ACCESS_TOKEN'), os.getenv('ACCESS_TOKEN_SECRET'))
api = tweepy.API(auth, wait_on_rate_limit=True)
csv_file = open('/home/dc/IS4152-twitter/' + datetime.date.today().isoformat() + '.csv', 'a')
csv_writer = csv.writer(csv_file, delimiter=',')
csv_writer.writerow(['tweet_id', 'text', 'link', 'created_at', 'timestamp_ms', 'user_id', 'user_name', 'user_screen_name', 'user_location', 'geo', 'coordinates', 'place_full_name', 'place_country', 'retweeted_status_id', 'in_reply_to_status_id', 'sarcasm_value'])

rgx = re.compile(r'[^0-9a-zA-Z !"#$%&\'()*+,-./:;<=>?@\[\\\]\^_`{|}~ \t\n\r]').search

results = api.search(q='cheese', count=100)

print(results[1].text)
class MyStreamListener(tweepy.StreamListener):
    # def get_sarcasm_val(tweet):
    #     url_safe_tweet = urllib.parse.quote_plus(tweet)
    #     with urllib.request.urlopen('http://www.thesarcasmdetector.com/_compute?sentence=' + url_safe_tweet) as resp:
    #         result = resp.read()
    #         return json.loads(result).get('result', None)
    def on_status(self, status):
        # with open('tweets.json', 'a') as file:
        #     file.write(json.dumps(status._json) + '\n')
        s = status
        valid = not bool(rgx(s.text))
        if valid:
            url_safe_tweet = urllib.parse.quote_plus(s.text)
            sarcasm_val = None
            try:
                with urllib.request.urlopen('http://www.thesarcasmdetector.com/_compute?sentence=' + url_safe_tweet) as resp:
                    result = resp.read()
                sarcasm_val = json.loads(result).get('result', None)
            except Exception as e:
                sarcasm_val = 'error'
                with open('/home/dc/IS4152-twitter/error.log', 'a') as file:
                    file.write(str(e))
            row = [s.id, s.text, f'https://twitter.com/{s.user.screen_name}/status/{s.id}', s.created_at, s.timestamp_ms, s.user.id, s.user.name, s.user.screen_name, s.user.location, s.geo, s.coordinates, s.place.full_name if s.place else None, s.place.country if s.place else None, s.retweeted_status.id if hasattr(s, 'retweeted_status') else None, s.in_reply_to_status_id, sarcasm_val]
            csv_writer.writerow(row)
            csv_file.flush()
        print(status.id, valid)
        return True



myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener)
# print(myStream)
# user_keyword=input("#Trump")
myStream.filter(track=['trump','biden'],locations=[-124.848633,24.766785,-59.545898,49.037868])
