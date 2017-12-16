/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
let http = require('http');

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.90d5695a-1eeb-4e45-bff1-4e23808eebf0'; 

const languageStrings = {
    'en': {
        translation: {
            PARTIES: [
                'A year on Mercury is just 88 days long.',
                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
                'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
                'On Mars, the Sun appears about half the size as it does on Earth.',
                'Earth is the only planet not named after a god.',
                'Jupiter has the shortest day of all the planets.',
                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
                'The Sun contains 99.86% of the mass in the Solar System.',
                'The Sun is an almost perfect sphere.',
                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
                'The temperature inside the Sun can reach 15 million degrees Celsius.',
                'The Moon is moving approximately 3.8 cm away from our planet every year.',
            ],
            PARTY_DETAILS: 'New Year Parties',
            GET_PARTY_DETAILS: "Here are the top parties in your city: ",
            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};


const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetPartyVenueIntent': function () {
        console.log(this.event.request.intent.slots.city.value)
        let city = this.event.request.intent.slots.city.value;
        
        const url = `http://city-party-api.herokuapp.com/api/party/${city}`;
        console.log(url)

        const _this = this;        
        http.get(url, function(res) {
            res.on('data', function (body) {
                body = JSON.parse(body);
                console.log('BODY: ' + body);

                let partyDetails, speechOutput; 
                if(body.length) {
                    const partyArr = _this.t('PARTIES');
                    const partyIndex = Math.floor(Math.random() * partyArr.length);
                    partyDetails = partyArr[partyIndex];
                    speechOutput = _this.t('GET_PARTY_DETAILS') + partyDetails;
                } else {
                    partyDetails = `Sorry could not find any parties in ${city} yet. Please check back later`;
                    speechOutput = partyDetails;
                }
        
                // Create speech output
                _this.emit(':tellWithCard', speechOutput, _this.t('PARTY_DETAILS'), partyDetails);

            })
        });

        
        
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
