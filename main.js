"use strict"

let fs = require('fs');
let path = require('path');

function main(){
	readCsvStoringen(); // create trajecten_stations.csv
	//readStations(); // rename stations
}

function readCsvStoringen(){
	let columns = ["RDT-ID", "traject", "Traject (RDT)", "stations"];
	require("csv-to-array")({
		file: "input/storingen-2011-2015.csv", // should not contain new lines inside cells
		columns: columns
	}, getTrajectenStations);
}

function getTrajectenStations(err, arr){
	console.log(err || arr.length+" rows loaded");

	console.log("removing unused properties");
	for(let i=0; i<arr.length; i++){
		delete arr[i]["RDT-ID"];
		delete arr[i]["Traject (RDT)"];
		arr[i].stations = arr[i].stations.split(',');
		for(let j=0; j<arr[i].stations.length; j++) arr[i].stations[j] = arr[i].stations[j].replace(/^\s\s*/, '')
	}

	console.log("filter unique values");

	arr = arr.filter(function(elem, pos) {
		return arr.indexOf(elem) == pos;
	});

	console.log(arr.length+" rows loaded");

	let newFile = "traject, station\r\n";
	for(let i=1; i<arr.length; i++){
		for(let j=0; j<arr[i].stations.length; j++){
			let station = arr[i].stations[j].toUpperCase();
			newFile += arr[i].traject+", "+station+"\r\n";
		}
	}

	writeToTrajectenStations(newFile);
}

function writeToTrajectenStations(data){
	let filePath = path.join(__dirname, "output/traject_station.csv");

	fs.writeFile(filePath, data, function(err) {
		if(err) return console.log(err);

		console.log("trajecten_stations.csv was saved!");
	}); 
}

/*function readStations(){
	let filePath = path.join(__dirname, "input/KNMI_stations.txt");

	fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
		if(err) return console.log(err);

		// replace names to match stations.csv
		data.replace("ROTTERDAM", "ROTTERDAM CENTRAAL");

		writeToStations(data);
	}); 
}

function writeToStations(data){
	let filePath = path.join(__dirname, "output/stations.csv");

	fs.writeFile(filePath, data, function(err) {
		if(err) return console.log(err);

		console.log("The file was saved!");
	}); 
}*/

main();
