const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {

    console.log('requested', req.url);
    console.log('req', req.headers)
    const path = `./public${req.url === '/' ? '/index.html' : req.url}`;

    const ip = res.socket.remoteAddress;
    const port = res.socket.remotePort;
    console.log(`Your IP address is ${ip} and your source port is ${port}.`);

    fs.readFile(path, (err, file) => {
        if (err) {
            console.log('file read error', path, err);
            res.write('error');
            res.end();
            return;
        }

        console.log('file read', path);

        res.write(file);
        res.end();
    });
});

try{
    server.listen(80);
    console.log('Node server started!!')
} catch (err) {
    console.log(err);
}
