'use strict'

const request = require('request')

module.exports = function getTrending(locationName, next) {


    // const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=a7bd7ffb3b16c818c01ee4c5a88ccfc4&q=boston`
       const requestUrl = `http://www.thehawaiiproject.com/get_books_for_categories.php?format=json&whitelabel=0&l=15&o=0&categories=fantasy`

  console.log('Making HTTP GET request to:', requestUrl)

  request(requestUrl, (err, res, body) => {
    if (err) {
console.log('error')
	console.log(err)
        console.log(res)

      throw new Error(err)
    }

    if (body) {
console.log('here')
console.log(res)
console.log(body)
      const parsedResult = JSON.parse(body)
      next(parsedResult)
    } else {
      next()
    }
  })
}
