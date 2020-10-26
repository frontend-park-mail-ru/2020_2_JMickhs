const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/public`));

const port = 511;

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(port, () => {
    console.log(`Server listening port ${port}`);
});
