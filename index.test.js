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



var exampleResponse = {
  "results": [
    {
      "alternatives": [
        {
          "transcript": "how old is the Brooklyn Bridge",
          "confidence": 0.987629,
          "words": [
            {
              "startTime": "0s",
              "endTime": "0.300s",
              "word": "how"
            },
            {
              "startTime": "0.300s",
              "endTime": "0.600s",
              "word": "old"
            },
            {
              "startTime": "0.600s",
              "endTime": "0.800s",
              "word": "is"
            },
            {
              "startTime": "0.800s",
              "endTime": "0.900s",
              "word": "the"
            },
            {
              "startTime": "0.900s",
              "endTime": "1.100s",
              "word": "Brooklyn"
            },
            {
              "startTime": "1.100s",
              "endTime": "1.500s",
              "word": "Bridge"
            }
          ]
        }
      ]
    }
  ]
}


test('testing recognize function', () => {
 
	client.recognize(sampleAudio,configSTT, function(error, response){
		if(error){
			console.error("There has been an error");
			//console.error(JSON.stringify(error.error.message, null, 2));
			// console.error(JSON.stringify(error,null,2));
		}else{
			 expect(response).toBe(exampleResponse);
			// console.log(JSON.stringify(response,null,2));
		}
	});

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