require('dotenv').config();

const app = require('./router/app.js');
const port = process.env.PORT || 3000;
const https = require('https');
const fss = require('fs');
const path = require('path');
const __dad = path.join(__dirname, './');
const privateKey = fss.readFileSync(path.join(__dad, 'sslcert', 'key.pem'), 'utf8');
const certificate = fss.readFileSync(path.join(__dad, 'sslcert', 'cert.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);


var server = httpsServer.listen(port, function () {
	console.log('Server running at port', port);
});

