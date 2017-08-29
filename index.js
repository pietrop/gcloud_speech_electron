'use strict';


const request = require('request');
const fs = require('fs');

/**
 *  https://cloud.google.com/speech/reference/rest/
 */
class Speech{
	constructor(apiKey) {
		this.apiKey = apiKey;
		this.headers = {'User-Agent': 'request'};
		// this.poolingInterval = 15; //seconds 
	}

	  /**
	   * [recognize description]
	   * https://cloud.google.com/speech/reference/rest/v1/speech/recognize
	   * @param  string, fileName [description]
	   * @param   Object, config   [description]
	   * @return {[type]}          [description]
	   */
	recognize(fileName, config, callback){

	  	var requestConfig = {
		  "config": config,
		  "audio": {
		  	//the audio file can be passed as string converted into base64 encoding, 
		  	// see google documentation https://cloud.google.com/speech/docs/base64-encoding
		   	// https://cloud.google.com/speech/reference/rest/v1/RecognitionAudio
		   "content": fs.readFileSync(fileName).toString('base64')
		  }
		};

		var options = {
	    	url: `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`,
	    	json: requestConfig,
	    	method: 'POST',
	    	headers: this.headers
		};

		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        // Print out the response body
		        // console.log(JSON.stringify(body,null,2));
		        if(callback){ callback(null, body); }else{ return body; }
		    }else{
		        // the error message seems to be found in the body of the response
		        if(callback){ callback(body, null); }else{ return error; }
		    }
		});
	}

	/**
	 * [longrunningrecognize description]
	 * https://cloud.google.com/speech/reference/rest/v1/speech/longrunningrecognize
	 * @param  {[type]}   fileName [description]
	 * @param  {[type]}   config   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	// longRunningRecognize(fileName, config, callback){
	// 	var self = this;
	// 	var requestConfig = {
	// 		"config": config,
	// 		"audio": {
	// 		//the audio file can be passed as string converted into base64 encoding, 
	// 		// see google documentation https://cloud.google.com/speech/docs/base64-encoding
	// 		// https://cloud.google.com/speech/reference/rest/v1/RecognitionAudio
	// 		"content": fs.readFileSync(fileName).toString('base64')
	// 		}
	// 	};
	// 	console.log(requestConfig.content);

	// 	var options = {
	// 		url: `https://speech.googleapis.com/v1/speech:longrunningrecognize?key=${this.apiKey}`,
	// 		json: requestConfig,
	// 		method: 'POST',
	// 		headers: this.headers
	// 	};

	// 	request(options, function (error, response, body) {
	// 		if (!error && response.statusCode == 200) {
	// 		// Print out the response body
	// 		// console.log(JSON.stringify(body,null,2));
	// 			var operationName = body.name;
	// 			console.log(operationName);
	// 			// set timeout 
	// 			self.getLongRunningRecognise(operationName,callback)
	// 			// if(callback){ callback(null, body); }else{ return body; }
	// 		}else{
	// 		// the error message seems to be found in the body of the response
	// 			if(callback){ callback(body, null); }else{ return error; }
	// 		}
	// 	});
	// }

	/*
	* https://cloud.google.com/speech/reference/rest/v1/operations/get
	*/
	// getLongRunningRecognise(name,callback){

	// 	var options = {
	//     	url: `https://speech.googleapis.com/v1/operations/${name}?key=${this.apiKey}`,
	//     	// json: requestConfig,
	//     	method: 'GET',
	//     	headers: this.headers
	// 	};

	// 	request(options, function (error, response, body) {
	// 	    if (!error && response.statusCode == 200) {
	// 	    	// console.log(response);
	// 	    	console.log(body.done)
	// 	        // Print out the response body
	// 	        // console.log(JSON.stringify(body,null,2));
	// 	        // if(callback){ callback(null, body); }else{ return body; }
	// 	    }else{
	// 	        // the error message seems to be found in the body of the response
	// 	        // if(callback){ callback(body, null); }else{ return error; }
	// 	    }
	// 	});
	// }
  }





module.exports =  Speech;