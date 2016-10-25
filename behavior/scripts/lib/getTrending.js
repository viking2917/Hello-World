'use strict'

const request = require('request')

module.exports = function getTrending(locationName, next) {


    //const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${appId}&q=${locationName}`
  const requestUrl = `http://www.thehawaiiproject.com/get_books_for_categories.php?format=json&whitelabel=0&l=15&o=0&categories=trending-books`

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