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
				if (option['proxy'] !== undefined) delete(option['proxy']);
				option['proxy'] = 'http://127.0.0.1:8118';
				console.log('refetch using proxy: '+option['proxy']);
				fetch(url, option, filename);
			} else {
				console.log('response timeout.');
				console.log('refetch without proxy.');
				fetch(url, option, filename);
			}
		} else {
			console.log(err.code);
		}
	});
}

let url = 'http://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png';
let option = {
	'timeout': 1500
}
let filename = 'test.png';

fetch(url, option, filename);