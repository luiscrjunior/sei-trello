const path = require('path');
const fs = require('fs');
const readline = require('readline');

/* Lê a versão da extensão */
const manifestFile = path.join(__dirname, '..', 'manifest.json');
const manifestContent = fs.readFileSync(manifestFile);
const manifestData = JSON.parse(manifestContent);
const version = manifestData.version;

/* Lê o changelog */
const changelogFile = path.join(__dirname, '..', '..', 'CHANGELOG.md');
const changelogContent = fs.readFileSync(changelogFile).toString();
const changelogLines = changelogContent.replace(/\r\n/g, '\n').split('\n');
const changes = [];
for (let line of changelogLines) {
  const reVersion = /^##\s\[(.*)\]\s+-\s+(.+\/.+\/.+)$/;
  const reItem = /^-\s(.+)$/;
  if (reVersion.test(line)) {
    const [, version, date] = line.match(reVersion);
    changes.push({ version, date, items: [] });
  }
  if (reItem.test(line)) {
    const [, item] = line.match(reItem);
    const lastVersion = changes[changes.length - 1];
    lastVersion.items = [...lastVersion.items, item];
  }
}

module.exports = {
  root: 'src/docs',
  input: ['index.html', 'instalacao.html', 'novidades.html'],
  output: 'docs',
  options: {
    sync: true,
  },
  plugins: {
    'posthtml-include': {
      root: './src/docs',
    },
    'posthtml-expressions': {
      locals: {
        version: version,
        changes: changes,
      },
    },
  },
};
