# unofficial Google Cloud Speech Node module compatible with Electron

A [google cloud speech](https://cloud.google.com/speech) node module to comunicate with the API that is compatible with Electron. 


## Issue with `@google-cloud/speech` and Electron

The official module, [`@google-cloud/speech`](https://www.npmjs.com/package/@google-cloud/speech), relies on [`grpc`](https://grpc.io/) as a dependencie and there is an [issue using the official module in electron ](https://github.com/GoogleCloudPlatform/google-cloud-node/issues/1621).

This is the error I would get when trying to integrat `@google-cloud/speech` in [electron](https://electron.atom.io) for adding google cloud speech as a STT option for [autoEdit](http://autoEdit.io).


```javascript
Uncaught Error: The module '/Users/pietropassarelli/Dropbox/CODE/Vox/TBVE/autoEdit_v2/node_modules/grpc/src/node/extension_binary/grpc_node.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 48. This version of Node.js requires
NODE_MODULE_VERSION 53. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or`npm install`).
    at process.module.(anonymous function) [as dlopen] (ELECTRON_ASAR.js:173:20)
    at Object.Module._extensions..node (module.js:598:18)
    at Object.module.(anonymous function) [as .node] (ELECTRON_ASAR.js:173:20)
    at Module.load (module.js:488:32)
    at tryModuleLoad (module.js:447:12)
    at Function.Module._load (module.js:439:3)
    at Module.require (module.js:498:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/Users/pietropassarelli/Dropbox/CODE/Vox/TBVE/autoEdit_v2/node_modules/grpc/src/node/src/grpc_extension.js:45:15)
    at Object.<anonymous> (/Users/pietropassarelli/Dropbox/CODE/Vox/TBVE/autoEdit_v2/node_modules/grpc/src/node/src/grpc_extension.js:49:3)
```

[Official documentation](https://cloud.google.com/speech/docs/basics) has more details on what are the features that requrie grpc. eg `Streaming Recognition`.

However both `Synchronous Recognition` and `Asynchronous Recognition` can be used with REST. 


## API keys

###  get an API key form google

[Follow these instrucitons from officinal documetnation](https://support.google.com/cloud/answer/6158862?hl=en)

>If your client application does not use OAuth 2.0, then it must include an API key when it calls an API that's enabled within a Google Cloud Platform project. The application passes this key into all API requests as a key=API_key parameter.

>To create your application's API key:
>
>1. Go to the [Cloud Platform Console](https://console.cloud.google.com/).
>2. From the projects list, select a project or create a new one.
3. If the APIs & services page isn't already open, open the left side menu and select **APIs & services**.
>4. On the left, choose **Credentials**.
>5. Click **Create credentials** and then select **API key**.


### Setup API keys in this module

To use the actual module, it is not opinionated about where you store your API key, as this is passed to the class constructor when creating a new instance. 

However to try the test/example I am using [`.env`](https://github.com/motdotla/dotenv) file in the root of the project. This is in .`gitignore` to avoid accidentally pushing it to github. So you need to create one as follows. This follows [the practice of storing sensistive information as enviroment variables](https://stackoverflow.com/questions/35356692/best-practice-when-using-an-api-key-in-node-js)

```
GSPEECHKEY=your_google_speech_api_key_here
```


## Example Usage

See [`example.js`](/example.js)


```javascript
'use strict';
require('dotenv').config();
const APIKEY= process.env.GSPEECHKEY;

var Speech = require('./index.js');

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
		// Do something with the Error
		console.error(JSON.stringify(error,null,2));
	}else{
		// Do something with the results
		console.log(JSON.stringify(response,null,2));
	}
});
```

Which would return the following json, with word accurate timings, because we have `enableWordTimeOffsets` set to `true`.

```json
{
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
```

## Example Error


Example error if you mistype one of the required parameters eg `LINEAR16----`.

```json
{
  "error": {
    "code": 400,
    "message": "Invalid value at 'config.encoding' (TYPE_ENUM), \"LINEAR16----\"",
    "status": "INVALID_ARGUMENT",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.BadRequest",
        "fieldViolations": [
          {
            "field": "config.encoding",
            "description": "Invalid value at 'config.encoding' (TYPE_ENUM), \"LINEAR16----\""
          }
        ]
      }
    ]
  }
}
```


## API file size restriciton

```json
{
  "error": {
    "code": 400,
    "message": "Request payload size exceeds the limit: 10485760 bytes.",
    "status": "INVALID_ARGUMENT"
  }
}
```

There seems to be a `10.48576` MB file size limit, when I tried to implement `longRunningRecognize`which I have not found in the documentation. 


## Tests

Tests are incomplete but for now you can run a minimal one with 

``` 
npm  test
```


# Possible room for improvement 

- [ ] [replace callback with promises](https://developers.google.com/web/fundamentals/getting-started/primers/promises) to be [closer to official module](https://www.npmjs.com/package/@google-cloud/speech) and make it easier to swap when needed (eg using electron)
- [ ] add more details to documentation 
- [ ] make more comprehensive tests with [`jest`](https://facebook.github.io/jest/)
- [ ] Find out how to test API SDK with jest, do you need to mock the API? 
- [ ] add long `longRunningRecognize` option to the module, with 15 sec polling to check when transcription is completed. (this raises limit to 80min, however file size limit to 10.48 mb makes it tricky to implement);


# Contributor

- [Pietro](http://twitter.com/pietropassarell)