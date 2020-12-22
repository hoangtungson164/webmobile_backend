require('dotenv').config();

const app = require('./router/app.js');
const config = require('./config/config')
const port = config.server.port;
const https = require('https');
const fss = require('fs');
const path = require('path');
const __dad = path.join(__dirname, './');
const privateKey = fss.readFileSync(path.join(__dad, 'sslcert', 'key.pem'), 'utf8');
const certificate = fss.readFileSync(path.join(__dad, 'sslcert', 'cert.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);
let http = require('http').Server(app);

var server = http.listen(port, function () {
	console.log('Server running at port', port);
});

/*
**Socket
**********Start****************
*/
// let server = https.createServer(credentials, app);
//socket.io instantiation
let socketIO = require('socket.io');
let io = socketIO.listen(http, { log: false, origins: '*:*' });
//listen on every connection
io.on('connection', (socket) => {
	console.log('socket mobile backend connected');

	//listen on new_message
	socket.on('mesage_A0001', (message) => {
		//broadcast the new message
		io.sockets.emit('mesage_A0001', message);
	})

	// colse socket
	socket.on('end', function () {
		socket.disconnect(0);
	});
});

// server.listen(config.server.socket, () => {
// 	console.log(`started on port: ${config.server.socket}`);
// });

/*
************end**************
*/