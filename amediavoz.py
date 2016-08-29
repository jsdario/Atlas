from __future__ import print_function
from bs4 import BeautifulSoup
from urllib2 import urlopen

BASE_URL = "http://amediavoz.com/"

html = urlopen(BASE_URL).read()
soup = BeautifulSoup(html, "lxml")
table = soup.find("table", id="table1")
poet_links = [BASE_URL + a["href"] for a in table.findAll("a")]

for link in poet_links:
    print link

def get_poems_from_author_link (author_link):
   html = urlopen(author_link).read()
   soup = BeautifulSoup(html, "lxml")
   # get text code block
   bq = soup.findAll("blockquote")[3]
   poem = bq.get_text()
   print(poem, file=open('autor','w'))

   return poem


