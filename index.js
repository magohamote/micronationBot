'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    
    let messaging_events = req.body.entry[0].messaging

    for (let i = 0; i < messaging_events.length; i++) {

      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id

      if (event.message && event.message.text) {

        let text = event.message.text;

        if (/[h,H]i/.test(text) || /[s,S]alut/.test(text) || /[b,B]onjour/.test(text) || /[h,H]ello/.test(text)) {
            sendTextMessage(sender, "Salut toi!");
            setTimeout(function() {
                  self.bot.reply(message, "Je suis le bot micronational (yé).");
                }, 200);
            setTimeout(function() {
                  self.bot.reply(message, "Tu peux me demander plein de trucs parmis cette liste de chose:\n- les coordonnées de la micronation");
                }, 200);
        }

        if (/.*[c,C]oordonn[e,é].+/.test(text)) {
            sendTextMessage(sender, "Les coordonnées de la micronation sont: 46.648059, 6.437642");
        }

        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }

      }
      if (event.postback) {
        let text = JSON.stringify(event.postback);
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
        continue
      }
    }
    res.sendStatus(200);
  })

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Que veux-tu savoir?",
                    "subtitle": "",
                    "image_url": "",
                    "buttons": [{
                        "type": "postback",
                        "title": "J'aimerais savoir les coordonées :)",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

const token = "EAAOUYYVOKF8BAA9ix6NjPjOqARIFocICwyjjTlo1R5MYkLGbDgTHjDPABPag80RE7xvZCucKTmzcunc3nofgAUJkDloGrpiiDCSZB6xYVTO56IJyxnugOjoKr8ZBlaPDNqXDBDTVvkJBlegFqCYVcgOZAQtoqZCibwhvHNrKnHgZDZD"