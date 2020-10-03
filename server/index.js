const fs = require('fs');
const http = require('http');
const debug = require('debug')('http')

const server = http.createServer((req, res) => {

    debug('requested', req.url);
    debug('req', req.headers)
    const path = `./public${req.url === '/' ? '/index.html' : req.url}`;

    const ip = res.socket.remoteAddress;
    const port = res.socket.remotePort;
    debug(`Your IP address is ${ip} and your source port is ${port}.`);

    fs.readFile(path, (err, file) => {
        if (err) {
            debug('file read error', path, err);
            res.write('error');
            res.end();
            return;
        }

        debug('file read', path);

        res.write(file);
        res.end();
    });
});

server.listen(80);

console.log('Node server started!!')
