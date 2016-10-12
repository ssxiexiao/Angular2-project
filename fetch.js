let request = require('request');
let fs = require('fs');
let path = require('path');

function fetch(url, option, filename) {
	let readStream = request.get(url, option);
	let writeStream = fs.createWriteStream(filename);
	readStream.on('data', function(chunk) {
		if (writeStream.write(chunk) === false) {
			readStream.pause();
		}
	});
	writeStream.on('drain', function() {
		readStream.resume();
	});
	readStream.on('end', function() {
		writeStream.end();
		console.log('fetch success.');
	});
	readStream.on('error', function(err) {
		writeStream.end();
		if (err.code === 'ETIMEDOUT') {
			if (err.connect === true) {
				console.log('connection timeout.');
			} else {
				console.log('response timeout.');
			}
			if (option['proxy'] !== undefined) delete(option['proxy']);
			option['proxy'] = proxy;
			console.log('refetch using proxy: '+option['proxy']);
			fetch(url, option, filename);
		} else {
			console.log(err.code);
		}
	});
}

let url = 'https://bufferblog-wpengine.netdna-ssl.com/wp-content/uploads/2014/05/Matter_Survey_Infographic_FINAL-1221.jpg';
let option = {
	'timeout': 2000
}
let filename = 'test.jpg';
let proxy = 'http://127.0.0.1:8118';

fetch(url, option, filename);