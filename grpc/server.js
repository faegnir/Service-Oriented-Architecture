const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('./proto/bookStore.proto', {});
const bookStorePackage = grpc.loadPackageDefinition(packageDefinition).bookStorePackage;

// Create a server
const server = new grpc.Server();

// Add the service
server.addService(bookStorePackage.Log.service, {
	'addLog': addLog,
	//'readBook': readBook,
	'readLogs': readLogs,
});

server.bindAsync('localhost:8080', grpc.ServerCredentials.createInsecure(), () => {
	console.log("Server running at http://127.0.0.1:50051");
	server.start();
}); // our sever is insecure, no ssl configuration


// Uhm, this is going to mirror our database, but we can change it to use an actual database.
const logs = [];

function addLog(call, callback) {
	const date = call.request.date;
	const first = call.request.first;
	const second = call.request.second;
	const operation = call.request.operation;
	const result = call.request.result;
	//console.log(log);
	const logObject = {'date': date, 'first': first, 'second': second, 'operation': operation,'result': result,
	};
	logs.push(logObject);
	callback(null, logObject);
}
function readLogs(call, callback) {
	console.log('There are ' + logs.length +' book in stash.');
	callback(null, { logs: logs });
}