// eslint-disable-next-line no-undef
const express = require('express');

const app = express();

// eslint-disable-next-line no-undef
app.use(express.static(`${__dirname}/public`));

const port = 80;

app.get('*', (req, res) => {
  console.log(req.url);
  // eslint-disable-next-line no-undef
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(port, () => {
  console.log(`Server listening port ${port}`);
});
