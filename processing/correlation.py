# Assumptions:

# Independent of case: Cases should be independent to each other.
# Linear relationship: Two variables should be linearly related to each other. This can be assessed with a scatterplot: plot the value of variables on a scatter diagram, and check if the plot yields a relatively straight line.
# Homoscedasticity: the residuals scatterplot should be roughly rectangular-shaped.


import urllib.request, json
import pandas as pd
import json
import numpy as np
from scipy.stats import pearsonr
def correlation():
    #@input: the processed json file
    #@output: the correlation coeefficient r for each candidate and the p score to show if it is significant

    #loading the polling data
    url = "https://projects.fivethirtyeight.com/polls/president-general/national/polling-average.json"
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    df = pd.DataFrame(data)
    df_t = df[df['candidate']=='Donald Trump']
    df_b = df[df['candidate']=='Joseph R. Biden Jr.']
    df_t['date'] = pd.to_datetime(df_t['date'])
    df_b['date'] = pd.to_datetime(df_b['date'])

    # loading the processed json file with sentiment score
    with open('../data/processed.json') as f: #insert the directory of the processed file
        processed = json.load(f)
    processed = pd.read_json('../data/processed.json')
    date_score = pd.DataFrame(columns=['date','t_compounded','b_compounded'])
    for i in range(len(processed)):
        tmp = pd.json_normalize(processed['sentiment'][i])
        t_score = tmp['trump.compounded'].mean()
        b_score = tmp['biden.compounded'].mean()
        date_score = date_score.append({'date': processed['date'][i],'t_compounded':t_score,'b_compounded':b_score},ignore_index=True)
    date_score = pd.merge_asof(date_score,df_t.sort_values('date'),on='date')
    date_score = pd.merge_asof(date_score,df_b.sort_values('date'),on='date')
    date_score.rename(columns={'pct_trend_adjusted_x':'t_pct','pct_trend_adjusted_y':'b_pct'},inplace=True)
    t_r,t_p =  pearsonr(date_score['t_compounded'],date_score['t_pct'])
    b_r,b_p =  pearsonr(date_score['b_compounded'],date_score['b_pct'])
    print(f'pearson correlation coefficient is {t_r} and the p-value is {t_p} ')
    print(f'pearson correlation coefficient is {b_r} and the p-value is {b_p} ')




