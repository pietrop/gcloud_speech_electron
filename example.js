'use strict';
require('dotenv').config();

var Speech = require('./index.js');

const APIKEY= process.env.GSPEECHKEY;

var sampleAudio = './brooklyn.wav';

var language = 'en-US';

var configSTT = {
	  "encoding": 'LINEAR16',
	  "sampleRateHertz": 16000,
	  // for supported languages see https://cloud.google.com/speech/docs/languages
	  "languageCode": language,
	  "maxAlternatives": 1,
	  "profanityFilter": false,
	  "enableWordTimeOffsets": true
};


var client = new Speech(APIKEY);

client.recognize(sampleAudio,configSTT, function(error, response){
	if(error){
		console.error("There has been an error");
		//console.error(JSON.stringify(error.error.message, null, 2));
		console.error(JSON.stringify(error,null,2));
	}else{
		console.log(JSON.stringify(response,null,2));
	}
});


// var sampleLongerAudio = '/Users/pietropassarelli/Desktop/tmp19Jul17/TMP2/Demo_media/Vox.com/norman_door/norman_door.mp4.temp.wav';
// client.longRunningRecognize(sampleLongerAudio,configSTT, function(error, response){
// 	if(error){
// 		console.error("There has been an error");
// 		//console.error(JSON.stringify(error.error.message, null, 2));
// 		console.error(JSON.stringify(error,null,2));
// 	}else{
// 		console.log(JSON.stringify(response,null,2));
// 	}
// });