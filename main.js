"use strict"

let fs = require('fs');
let path = require('path');

let storingColumns = ["RDT-ID", "Traject (NS)", "Traject (RDT)", "Stations (RDT)", "Oorzaak", "Start", "Einde", "Duur", "Prognose 1", "Verschil prognose/eindtijd", "Bericht 1"];

function main(){
	readCsvStoringen(); // create trajecten_stations.csv
	//renameStations(); // rename stations
}

function readCsvStoringen(){
	require("csv-to-array")({
		file: "input/storingen-2011-2015.csv", // should not contain new lines inside cells
		columns: storingColumns
	}, modifyStoringen);
}

function modifyStoringen(err, arr){
	console.log(err || arr.length+" rows loaded");

	addStoringDate(arr);
	getTrajectenStations(arr);	
}

function addStoringDate(arr){
	let newFile = "";

	arr[0].YYYYMMDD = "YYYYMMDD";
	let length = Object.keys(arr[0]).length;

	Object.keys(arr[0]).forEach(function(key, index) {
		newFile += arr[0][key] + (index!=length-1 ? "," : "\r\n");
	});

	for(let i=1; i<arr.length; i++){
		arr[i].YYYYMMDD = arr[i].Start.substring(0, 10).replace(/-/g, '');
		length = Object.keys(arr[i]).length;

		Object.keys(arr[i]).forEach(function(key, index){
			let quote = (arr[i][key].indexOf(",")>-1 ? "\"" : ''); //add quotes if cell has multiple values
			newFile += quote + arr[i][key] + quote + (index!=length-1 ? "," : "\r\n");
		});
	}

	writeFile("storingen.csv", newFile);
}

function getTrajectenStations(arr){
	console.log("removing unused properties");
	for(let i=0; i<arr.length; i++){
		arr[i].stations = arr[i]["Stations (RDT)"].split(',');
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
			newFile += arr[i]["Traject (NS)"]+", "+station+"\r\n";
		}
	}

	writeFile("traject_station.csv", newFile);
}

function writeFile(fileName, data){
	let filePath = path.join(__dirname, "output/"+fileName);

	fs.writeFile(filePath, data, function(err) {
		if(err) return console.log(err);
		console.log(fileName+" was created!");
	}); 
}

function renameStations(){
	let filePath = path.join(__dirname, "input/KNMI_stations.txt");

	fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
		if(err) return console.log(err);

		// replace names to match stations.csv
		data.replace("ROTTERDAM", "ROTTERDAM CENTRAAL");

		writeToStations(data);
	}); 
}

main();
