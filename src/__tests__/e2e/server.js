const path = require('path');
const express = require('express');
const app = express();

const expandedPath = path.join(__dirname, '..', '..', '..', 'dist', 'expanded');

app.use(express.static(__dirname + '/html'));

app.use('/css', express.static(path.join(expandedPath, 'css')));
app.use('/js', express.static(path.join(expandedPath, 'js')));

app.listen(3000);
