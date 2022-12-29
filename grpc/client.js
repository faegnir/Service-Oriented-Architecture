const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('./proto/bookStore.proto', {});
const fs = require('fs');
const fsa = require('fs/promises');
const bookStorePackage = grpc.loadPackageDefinition(packageDefinition).bookStorePackage;

const client = new bookStorePackage.Log('localhost:8080', grpc.credentials.createInsecure());
var count = 0;
let rawdata = fs.readFileSync('./apiPath/aps.json');
let log = JSON.parse(rawdata);
for(var i in log) {
    count++;
}
images = [];
console.log("syac"+ count);

for(var i=0;i<count;i++){

	client.addLog({'date': Object.keys(log)[i], 'first':Object.values(log)[i][0] , 'second': Object.values(log)[i][1], 'operation': Object.values(log)[i][2],'result': Object.values(log)[i][3]} , async (err, response) => {
	if (err) {
		console.log(err);
	} else {
  		images.push(response);
		fs.writeFile("./apiPath/api.json",JSON.stringify(images),(err) => {
		if (err) throw err;	
		console.log('The file has been saved!');
		});
	}
	});
}

/*{"2022-12-29 04:02:59": [1, 2, "Toplama", 3],"2:592022-12-29 04:0": [2, 4, "Tosdlama", 3]}
	client.readBook({ 'id': 1 }, (err, response) => {
		if (err) {
		console.log(err);
		} else {
		console.log(`From server`, JSON.stringify(response));
		}
	});*/

	/*client.readLogs(null, (err, response) => {
	  if (err) {
		console.log(err);
	  } else {
		console.log(`From server`, JSON.stringify(response));
	  }
	  fs.writeFile("./apiPath/api.json",JSON.stringify(response),(err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	  });
	});*/