'use strict'

const request = require('request')

module.exports = function getTrending(locationName, next) {

  const requestUrl = `https://www.thehawaiiproject.com/get_books_for_categories.php?format=json&whitelabel=0&l=15&o=0&categories=trending-books'

  console.log('Making HTTP GET request to:', requestUrl)

  request(requestUrl, (err, res, body) => {
    if (err) {
      throw new Error(err)
    }

    if (body) {
      const parsedResult = JSON.parse(body)
      next(parsedResult)
    } else {
      next()
    }
  })
}
