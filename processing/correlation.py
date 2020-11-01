import urllib, json

url = "https://projects.fivethirtyeight.com/polls/president-general/national/polling-average.json"
response = urllib.urlopen(url)
data = json.loads(response.read())
print(data)