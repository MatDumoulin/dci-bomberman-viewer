const express = require('express');
const app = express();
const port = 4200;

app.use(express.static(__dirname + '/dist/Bomberman-viewer'));

app.get('/*', (req, res) => {
  res.sendFile('index.html', {root: __dirname + "/dist/Bomberman-viewer"});
});

app.listen(port, () => {
    console.log("Listening on port", port);
});
