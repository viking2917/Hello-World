'use strict'

const urlTools = require('./lib/urls')
const getTrending = require('./lib/getTrending')
const getSimilar = require('./lib/getSimilar')


const firstOfEntityRole = function(message, entity, role) {
  role = role || 'generic';
  const slots = message.slots
  const entityValues = message.slots[entity]
  const valsForRole = entityValues ? entityValues.values_by_role[role] : null

  return valsForRole ? valsForRole[0] : null
}


exports.handle = function handle(client) {

    const sayHello = client.createStep({
	satisfied() {
	    return Boolean(client.getConversationState().helloSent)
	},

	prompt() {
	    client.addResponse('app:response:name:welcome')
	    client.addResponse('app:response:name:provide/documentation', {
		documentation_link: 'http://docs.init.ai',
	    })
	    client.addResponse('app:response:name:provide/instructions')
	    client.updateConversationState({
		helloSent: true
	    })
	    client.done()
	}
    })

    const untrained = client.createStep({
	satisfied() {
	    return false
	},

	prompt() {
	    client.addResponse('app:response:name:apology/untrained')
	    client.done()
	}
    })


    const handleGreeting = client.createStep({
	satisfied() {
	    return false
	},

	prompt() {
	    client.addTextResponse('Aloha human!')
	    client.done()
	}
    })

    const handleGoodbye = client.createStep({
	satisfied() {
	    return false
	},

	prompt() {
	    client.addTextResponse('Mahalo and Aloha!')
	    client.done()
	}
    })

    const provideTrendingBook = client.createStep({
	satisfied() {
	    return false
	},

	prompt(callback) {
	    getTrending(resultBody => {
		if (!resultBody) {
		    console.log('Error getting trending book.')
		    callback()
		    return
		}

		const bookData = {
		    BookTitle: resultBody.books[0].title,
		    AuthorName: resultBody.books[0].authorstring,
		    BookLink: 'https://www.thehawaiiproject.com/' + urlTools.book_url(resultBody.books[0].title,resultBody.books[0].authorstring,resultBody.books[0].bookid),
		}

		console.log('sending book data:', bookData)
		client.addResponse('app:response:name:provide_popular_book', bookData)
		client.addImageResponse( resultBody.books[0].coverarturl, 'The product')
		client.done()
		callback()
	    })
	},
    })

    const provideSimilarBook = client.createStep({
	satisfied() {
	    return false
	},

	prompt(callback) {

	    const bookTitle = firstOfEntityRole(client.getMessagePart(), 'booktitle')
	    console.log(bookTitle)
	    const bookAuthor = firstOfEntityRole(client.getMessagePart(), 'authorname')
	    console.log(bookAuthor)

	    getSimilar(bookTitle, bookAuthor, resultBody => {
		if (!resultBody) {
		    console.log('Error getting trending book.')
		    callback()
		    return
		}

		const relBook1 = resultBody.relatedbooks[0];
		const relBook2 = resultBody.relatedbooks[1];
		
		const bookData1 = {
		    BookTitle: relBook1.title,
		    AuthorName: relBook1.authorstring,
		    BookLink: 'https://www.thehawaiiproject.com/' + urlTools.book_url(relBook1.title,relBook1.authorstring,relBook1.bookid),
		}
		const bookData2 = {
		    BookTitle: relBook2.title,
		    AuthorName: relBook2.authorstring,
		    BookLink: 'https://www.thehawaiiproject.com/' + urlTools.book_url(relBook2.title,relBook2.authorstring,relBook2.bookid),
		}

		console.log('sending book data:', bookData1)
		console.log('sending book data:', bookData2)
		client.addResponse('app:response:name:provide_response_recommendation', bookData1)
		client.addImageResponse( relBook1.coverarturl, 'The product')
		client.done()
		callback()
	    })
	},
    })

    const askBook = client.createStep({
	satisfied() {
	    return false
	},
	
	prompt() {
	    client.addTextResponse('What have you read recently you liked?')
	    client.expect('liked_book', ['decline', 'similar1'])  // these are streams, not message classifications.
	    client.done()
	}
    })

    client.runFlow({
	classifications: {
	    greeting: 'greeting',
	    goodbye: 'goodbye',
	    ask_trending_book: 'trending',
	    //provide_response_recommendation: 'similar',
	    liked_book: 'similar',
      
	    // map inbound message  classifications to names of streams
	},
	autoResponses: {
	    // configure responses to be automatically sent as predicted by the machine learning model
	    //provide_popular_book: 'getTrending',
	},
	streams: {
	    //greeting: handleGreeting,
	    greeting: [askBook],
	    goodbye: handleGoodbye,
	    trending: provideTrendingBook,
	    similar: provideSimilarBook,
	    main: [askBook],

	    //main: [provideTrendingBook],
	    //main: 'getTrending',
	    //onboarding: [sayHello],
	    onboarding: [askBook],
	    end: [untrained],
	}
    })
}
