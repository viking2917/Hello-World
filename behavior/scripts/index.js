'use strict'

const urlTools = require('./lib/urls')
const getTrending = require('./lib/getTrending')

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

    const askBook = client.createStep({
	satisfied() {
	    return false
	},
	
	prompt() {
	    client.addTextResponse('What have you read recently you liked?')
	    client.expect('liked_book', ['decline', 'provideSimilar'])
	    client.done()
	}
    })

    client.runFlow({
	classifications: {
	    greeting: 'greeting',
	    goodbye: 'goodbye',
	    ask_trending_book: 'trending',
	    provide/response_recommendation: 'similar',
      
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
	    similar: provideTrendingBook,
	    main: [askBook],

	    //main: [provideTrendingBook],
	    //main: 'getTrending',
	    //onboarding: [sayHello],
	    onboarding: [askBook],
	    end: [untrained],
	}
    })
}
