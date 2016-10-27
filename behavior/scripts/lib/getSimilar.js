'use strict'

const request = require('request')

module.exports = function getSimilar(bookTitle, bookAuthor, next) {


    // const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=a7bd7ffb3b16c818c01ee4c5a88ccfc4&q=boston`
    const title = bookTitle
    const author = bookAuthor
    
       const requestUrl = 
{ method: 'GET'
  , uri: `http://local.thehawaiiproject.com/get_book_details.php?format=json&title=${title}&author=${author}`
  , timeout: 15000 }


  console.log('Making HTTP GET request to:', requestUrl)

  request(requestUrl, (err, res, body) => {
      if (err || (res.statusCode != 200)) {
	  console.log('error: error code ' + res.statusCode)
	  console.log(err)
	  throw new Error(err)
      }

      if (body) {
	  const parsedResult = JSON.parse(body)
//	  console.log(parsedResult)
	  next(parsedResult)
      } else {
	  next()
      }
  })
}
