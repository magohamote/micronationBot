'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const blagues = [
    "Ta mère est tellement grosse qu'il y a un décalage horaire entre ses deux fessses !",
    "Deux secrétaires papotent pendant une pause. La première demande à l'autre :\n- Tu fumes après l'amour ?\n- Je ne sais pas, j'ai jamais regardé.",
    "Ta vie. (outch, salo)",
    "J'ai cru que Mozart était mort mais mozzarella (c'est une blague carambar)",
    "C'est la blague de la cravate : elle est longue et plate. (mon dieu mais c'est tellement nul.)",
    "C'est deux otaries qui se racontent des blagues. Une des deux rigoles et l'autre dit : \"Oh! T'as ris\"",
    "J'ai pas trop envie de te raconter une blague là en fait.",
    "C'est un type qui entre dans un bar il dit \"Salut c'est moi!\" mais en fait c'était pas lui.",
    "C'est 2 muffins dans un four, y en a un qui dit : \"Il fait chaud ici!\" et l'autre répond: \"AAAhhhrhewrjesh un muffin qui parle!\""
]

const contrepeteries = [
    "L'Afrique est bonne hôtesse et ses canicules vous emballent.",
    "Le boutre du sultan remontait le confluent de la garonne",
    "Juliette revenait de la ferme pleine d'espoir, jusqu'au pont du Jura.",
    "Les envahisseurs arrivèrent à pied par la Chine.",
    "Salut Patrick!",
    "Parle plus fort, elle me brouille l'écoute!",
    "Salut Fred!",
    "Je te laisse le choix dans la date"
]

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
                  sendTextMessage(sender, "Je suis le bot micronational (yé).");
                }, 200);
            setTimeout(function() {
                  sendTextMessage(sender, "Tu peux me demander plein de trucs comme:\n- les coordonnées de la micronation\n- les dates du Scabryollaud\n- une blague\n- une contrepèteries");
                }, 400);
        } else if (/.*[c,C]oordonn[e,é].+/.test(text) || (/.*o[u,ù].+/.test(text) && /.*[p,P]etiou.+/.test(text) && /.*[p,P]ayi.+/.test(text))) {
            sendTextMessage(sender, "Les coordonnées de la micronation sont: 46.648059, 6.437642");
        } else if (/.*[s,S]cabr.+/.test(text) && /.*[d,D]ate.*/.test(text)) {
            sendTextMessage(sender, "le Scabryollaud se passe du 1er au 9 juillet du calendrier païen. (Be there, ça va être rigolo)");   
        } else if (/.*[b,B]lague.*/.test(text) || /.*[j,J]oke.*/.test(text)) {
            sendTextMessage(sender, blagues[getRandomInt(0, blagues.length-1)]);   
        } else if (/.*[c,C]ontrep[è,e,é]t.*/.test(text) || /.*[c,C]ontrp[è,e,é]t.*/.test(text)) {
            sendTextMessage(sender, contrepeteries[getRandomInt(0, contrepeteries.length-1)]);   
        } else if (/.*plus.*/.test(text) && /.*belle.*/.test(text) && /.*\?.*/.test(text)) {
            sendTextMessage(sender, "Mais quelle question, c'est Tianyi Lin bien évidemment.");
        } else if (/.*[m,M]erci.+/.test(text) || /.*[t,T]hank.+/.test(text)) {
            sendTextMessage(sender, "De rien ;)");
        } else if (/.*[r,R]oi.+/.test(text)) {
            sendTextMessage(sender, "Le Roi du Petiou Payi est Valentin 1er.");
        } else {
            sendTextMessage(sender, "Désolé on ne m'a pas encore codé pour répondre à ça. (Ou alors t'écris trop mal pour que je comprenne)");   
            setTimeout(function() {
                  sendTextMessage(sender, "Tu peux me demander des trucs comme:\n- les coordonnées de la micronation\n- les dates du Scabryollaud\n- une blague\n- une contrepèteries");
                }, 200);
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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