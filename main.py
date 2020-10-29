import sentiment_analysis

def process_csv(path_to_csv):
    a = sentiment_analysis('data/2020-10-16.csv') #replace with path when done
    a.add_processed()
    a.score_tweets()
    a.separate_scores()
    a.label_candidates()
    print(a.df.head())
    a.df['timestamp'] = datetime.fromtimestamp(a.df['timestamp_ms'])
    a.df.to_json('test.json')
    a.df.to_csv('output.csv')