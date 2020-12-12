const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const expandedPath = path.join(__dirname, '..', '..', '..', 'dist', 'expanded');

app.use(express.static(__dirname + '/html'));

app.get('/vendor/css/fontawesome-all.css', async (req, res) => {
  const content = await readFile(path.join(expandedPath, 'vendor', 'css', 'fontawesome-all.css'));
  const modifiedContent = content.toString().replace(/chrome-extension:\/\/__MSG_@@extension_id__/g, '');
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(modifiedContent);
  res.end();
});

app.use('/vendor', express.static(path.join(expandedPath, 'vendor')));
app.use('/css', express.static(path.join(expandedPath, 'css')));
app.use('/js', express.static(path.join(expandedPath, 'js')));

app.listen(3000);
