const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from demo app! BUILD: ' + process.env.BUILD_NUMBER);
});

app.listen(port, () => {
  console.log('App listening on', port);
});
