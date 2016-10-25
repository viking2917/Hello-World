'use strict'


const request = require('request')

module.exports = function getTrending(locationName, next) {


    // const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=a7bd7ffb3b16c818c01ee4c5a88ccfc4&q=boston`
       const requestUrl = 
{ method: 'GET'
  , uri: `http://www.thehawaiiproject.com/get_books_for_categories.php?format=json&whitelabel=0&l=2&o=0&categories=trending-books`
  , timeout: 15000 }


  console.log('Making HTTP GET request to:', requestUrl)

  request(requestUrl, (err, res, body) => {
      if (err || (res.statusCode != 200)) {
	  console.log('error: error code ' + res.statusCode)
	  console.log(err)
	  
	  throw new Error(err)
      }

      if (body) {
console.log('here')
//console.log(body)
      const parsedResult = JSON.parse(body)
console.log(parsedResult)
      next(parsedResult)
    } else {
      next()
    }
  })
}
