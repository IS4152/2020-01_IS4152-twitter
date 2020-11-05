import logging
from os import path
import re
import gensim
import gensim.corpora as corpora
from gensim.utils import simple_preprocess
import nltk
# nltk.download('stopwords')
from nltk.corpus import stopwords
from wordcloud import WordCloud
import spacy

import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger('mylogger')

def topic_model(data, output_dir):
    logger.debug('inside topic_model')
    topics_count = 5
    # Remove any urls
    data = [re.sub(r'http\S+', '', sent) for sent in data]
    # Remove words with less than 3 chars
    data = [re.sub(r'\b\w{1,2}\b', '', sent) for sent in data]
    # Remove new line characters
    data = [re.sub(r'\s+', ' ', sent) for sent in data]

    def sentences_to_words(sentences):
        for sentence in sentences:
            yield(gensim.utils.simple_preprocess(str(sentence), deacc=True))  # deacc=True removes punctuations
    data_words = list(sentences_to_words(data))
    logger.info('data_words')

    # generate words frequency wordcloud
    wordcloud = WordCloud(width=800, height=450, max_font_size=110).generate(' '.join([item for sublist in data_words for item in sublist]))
    wordcloud.to_file(path.join(output_dir, 'frequency.png'))

    # NLTK Stop words
    stop_words = stopwords.words('english')
    stop_words.extend(['rt', 'https', 'http', 'from', 'subject', 're', 'edu', 'use'])

    # Remove Stop Words
    data_words_nostops = [[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in data_words]
    logger.info('data_words_nostops')

    # lemmatization using spacy, see https://spacy.io/api/annotation
    nlp = spacy.load('en', disable=['parser', 'ner'])
    # Do lemmatization keeping only noun, adj, vb, adv
    allowed_postags=['NOUN', 'ADJ', 'VERB', 'ADV']
    data_lemmatized_words = []
    for sent in data_words_nostops:
        doc = nlp(" ".join(sent)) 
        data_lemmatized_words.append([token.lemma_ for token in doc if token.pos_ in allowed_postags])

    logger.info('lemmatized')

    # Create Dictionary
    id2word = corpora.Dictionary(data_lemmatized_words)
    # Create Corpus
    texts = data_lemmatized_words
    # Term Document Frequency
    corpus = [id2word.doc2bow(text) for text in texts]

    # Save dictionary and corpus
    id2word.save_as_text(path.join(output_dir, 'id2words.txt'))
    corpora.MmCorpus.serialize(path.join(output_dir, 'corpus.mm'), corpus)
    logger.info('dictionary and corpus saved')

    lda_model = gensim.models.ldamodel.LdaModel(corpus=corpus,
                                                id2word=id2word,
                                                num_topics=topics_count,
                                                update_every=1,
                                                chunksize=1000,
                                                passes=1,
                                                alpha='auto',
                                                per_word_topics=True,
                                                minimum_probability=0.10,
                                                minimum_phi_value=0.10)
    # Save model to disk.
    lda_model.save(path.join(output_dir, 'model'))
    logger.info('model saved')

    topics_word_freq = []
    for topic in lda_model.show_topics(formatted=False):
        word_freq = dict(topic[1])
        wordcloud = WordCloud(width=800, height=450).generate_from_frequencies(word_freq)
        wordcloud.to_file(path.join(output_dir, 'topic-{}.png'.format(topic[0])))
        topics_word_freq.append(word_freq)
    return topics_word_freq

if __name__ == '__main__':
    topic_model()