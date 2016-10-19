'use strict'

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
	    client.addTextResponse('Aloha!')
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

	prompt() {
	    // Need to provide weather
	    console.log('send trending book');
	    client.done()
	},
    })


    client.runFlow({
	classifications: {
	    goodbye: 'goodbye',
	    greeting: 'greeting'
	    // map inbound message classifications to names of streams
	},
	streams: {
	    goodbye: handleGoodbye,
	    greeting: handleGreeting,
//	    main: 'onboarding',
	    main: 'getTrending',
	    onboarding: [sayHello],
	    end: [untrained],
	    getTrending: [provideTrendingBook],
	}
  })
}
