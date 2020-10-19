from bs4 import BeautifulSoup as bs # Note: Hint: suggest using bs for subsequent parsing of HTML source
from selenium import webdriver
import time
driver = webdriver.Chrome('input path to chromedriver if not added to PATH')
page_url = 'https://sprs.parl.gov.sg/search/home'
driver.get(page_url)
time.sleep(2)
# Get search box and fill it up
search = driver.find_element_by_xpath('//*[@id='divmpscreen2']/div[2]/div[1]/div/div[1]/input')
search.send_keys('enter search term here')
# Uncomment following two lines to only search in titles
# checkbox = driver.find_element_by_xpath('//*[@id="divmpscreen2"]/div[2]/div[1]/div/label/input')
# checkbox.click()
# This will select the 13th parliament
session = driver.find_element_by_xpath('/html/body/app-root/app-search/div/div[2]/div[2]/div[1]/div/div[2]/select/option[14]')
session.click()
# Find submit element and click
submit = driver.find_element_by_css_selector('button.btn-black:nth-child(2)')
submit.click()
print('Search parameters submitted.')
# Create empty dictionary to store results
res_dict = {}
# Switch window and check for number of search results
driver.switch_to.window(driver.window_handles[1])
num_results = driver.find_element_by_css_selector('#searchResults > div:nth-child(1) > div')
res = num_results.text.split(' ')
num_clicks = int(res[-1]) // int(res[-3]) + 1
print('There are {} pages to click through.'.format(num_clicks))
# Nested for loop to click through all search results
for click in range(num_clicks):
# This assumes that 20 search results are returned, which are 1-indexed in the xpaths
    for item in range (1, 21):
    # Switch to search results page
        driver.switch_to.window(driver.window_handles[1])
        # Get element to click on, to see each individual page with content
        # Last page will have fewer than 20 elements, so need to handle this exception
        try:
            elem = driver.find_element_by_xpath('//*[@id="searchResults"]/table/tbody[{}]/tr[1]/td[2]/a'.format(item))
            elem.click()
        except:
            break
        # Switch to page with content and get URL name
        driver.switch_to.window(driver.window_handles[2])
        item_key = driver.current_url.split('/')[-1]
        item_key = item_key.replace('?', '_') # Replace ? because it would be an invalid filename
        # Append result to dictionary for later processing
        res_dict[item_key] = driver.page_source
        # Write out each page source as a file
        with open(item_key + '.txt', encoding = 'utf-8', mode = 'w+') as file:
            file.write(driver.page_source)
        # Close tab
        driver.close()
    # Switch back to search results tab
    driver.switch_to.window(driver.window_handles[1])
    # Click on next page once 20 results have been saved
    # Next page button changes after first 20 results are shown, hence the need for enclosing the element xpath in a try block
    try:
        next_page = driver.find_element_by_xpath('//*[@id="searchResults"]/div[3]/section/ul/li[3]/a/em')
    except:
        next_page = driver.find_element_by_xpath('//*[@id="searchResults"]/div[3]/section/ul/li[1]/a/em')
        next_page.click()
    # Sleep momentarily because next page takes a while to load
    time.sleep(2)
#Check that all results are stored
assert len(res_dict.keys()) == int(res[-1]), "It looks like not all the results were stored!"