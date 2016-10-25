'use strict'

const _MyURLS = require('./lib/urls')
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

    // const collectCity = client.createStep({
    // 	satisfied() {
    // 	    return Boolean(client.getConversationState().weatherCity)
    // 	},

    // 	prompt() {
    // 	    // Need to prompt user for city    
    // 	    console.log('Need to ask user for city')
    // 	    client.done()
    // 	},
    // })

    const provideTrendingBook = client.createStep({
	satisfied() {
	    return false
	},


	prompt(callback) {
	    getTrending('New York', resultBody => {
		if (!resultBody) {
		    console.log('Error getting trending book.')
		    callback()
		    return
		}

		const weatherDescription = (
		    resultBody.books.length > 0 ?
			resultBody.books[0].title :
			null
		)

		const weatherData = {
		    BookTitle: resultBody.books[0].title,
		    AuthorName: resultBody.books[0].authorstring,
		    BookLink: 'https://local.thehawaiiproject.com/' + book_url(resultBody.books[0].title,resultBody.books[0].authorstring,resultBody.books[0].bookid),
		    // 'https://www.thehawaiiproject.com/book/The-Girl-on-the-Train--by--Paula-Hawkins--47665'

		    // temperature: resultBody.main.temp,
		    // condition: weatherDescription,
		    // city: resultBody.name,
		}

		console.log('sending real weather:', weatherData)
		client.addResponse('app:response:name:provide_popular_book', weatherData)
		//client.addResponse('app:response:name:provide_weather/current', weatherData)
		client.done()
		callback()
	    })
	},
	// prompt() {
	//     console.log('send trending book');
	//     let weatherData = {
	// 	BookTitle: '50 Shades of Gray',
	// 	AuthorName: 'E.L. James',
        //         BookLink: 'https://www.thehawaiiproject.com/book/The-Girl-on-the-Train--by--Paula-Hawkins--47665'
	//     }
	    
	//     client.addResponse('app:response:name:provide_popular_book', weatherData)
	//     client.done()
	// },
    })

    client.runFlow({
	classifications: {
	    goodbye: 'goodbye',
	    greeting: 'greeting'
	    // map inbound message  classifications to names of streams
	},
	streams: {
	    greeting: handleGreeting,
	    goodbye: handleGoodbye,
	    //	    main: 'onboarding',
	    main: 'getTrending',
	    onboarding: [sayHello],
	    end: [untrained],
	    getTrending: [provideTrendingBook],
	}
    })
}
