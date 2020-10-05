const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {

    console.log('requested', req.url);
    console.log('req', req.headers);

    let path;
    if (req.url.endsWith('css') || req.url.endsWith('js')) {
        path = `./public${req.url}`;
    } else {
        path = './public/index.html';
    }

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
    console.log('Node server started!!');
} catch (err) {
    console.log(err);
}
