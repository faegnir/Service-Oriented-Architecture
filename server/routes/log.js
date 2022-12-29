const { json } = require('body-parser');
const url = require('url');

const logRoutes = (app, fs) => {

    // variables
    const dataPath = './routes/log.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/log', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });
    app.get('/grpcApi', (req, res) => {
        fs.readFile(__dirname + '/../../grpc/apiPath/api.json', 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    app.get('/log/:code', (req, res) => {

        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            var jsonParsed = JSON.parse(data);
            
            if (req.params.code == "usd") { 
                res.send(jsonParsed.rate);
            }
            else if (req.params =="eur"){
                res.send(jsonParsed.eur.rate);
            }
            else{
                res.status(404);
            }
        });
    });

    // CREATE
    app.post('/log', (req, res) => {

        readFile(data => {
            // Note: this isn't ideal for production use. 
            // ideally, use something like a UUID or other GUID for a unique ID value
            const newLogId = Date.now().toString();

            // add the new user
            data[newLogId.toString()] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new log added');
            });
        },
            true);
    });


    // UPDATE
    app.put('/log/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const newLogId = req.params["id"];
            data[newLogId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${newLogId} updated`);
            });
        },
            true);
    });


    // DELETE
    app.delete('/log/:id', (req, res) => {

        readFile(data => {

            // delete the user
            const newLogId = req.params["id"];
            delete data[newLogId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${newLogId} removed`);
            });
        },
            true);
    });
};

module.exports = logRoutes;
