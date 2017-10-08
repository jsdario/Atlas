const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const Promise = require('bluebird')

// Downloads and caches all poet documents into amediavoz.com/links.json
function scrapLinks () {
  const site = fs.readFileSync('amediavoz.com/index.html')
  const $ = cheerio.load(site)
  // Get all author links from the general alphabet index
  const linksMap = $('#table1 a')
  const authorLinks = Object.keys(linksMap)
  .map(k => linksMap[k].attribs && linksMap[k].attribs.href)
  fs.writeFileSync('./amediavoz.com/links.json', JSON.stringify(authorLinks))
  return authorLinks
}

// Download all poets to avoid DDoSing the website
function cachePoets (authorLinks) {
  Promise.map(authorLinks, async link => {
    if (!link) {
      console.log('Skipping', link)
      return Promise.resolve()
    }

    try {
      const path = link.split('/')[link.split('/').length - 1]

      if (fs.existsSync('./amediavoz.com/poets/' + path)) {
        console.log('Skipping', link, 'already exists')
        return Promise.resolve()
      }

      console.log('Scrapping %s into %s', link, path)
      const site = await axios.get(link)
      fs.writeFileSync('./amediavoz.com/poets/' + path, site.data)
    } catch (err) {
      console.log('Error with', link)
      if (err.response && err.response.status === 404) {
        console.error('404 Not found')
        return Promise.delay(2000)
      }
      console.error(err)
    }

    return Promise.delay(2000)
  }, { concurrency: 1 })
}

function scrapPoemsFromPoetHtml(poetHtml) {
  const $ = cheerio.load(poetHtml)
  const poemlinks = $('blockquote a')
  console.log(poemlinks)
}

// cachePoets(scrapLinks())

const poetHtml = fs.readFileSync('amediavoz.com/poets/abril.htm')
scrapPoemsFromPoetHtml(poetHtml)
