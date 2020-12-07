#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

const appPath = path.resolve(__dirname, 'dist/expanded');
const outputPath = path.resolve(__dirname, 'dist/bundled');

const appManifest = require(path.resolve(__dirname, 'src/manifest.json'));

const runCommands = (commands) => {
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    const step = i + 1;
    try {
      console.log(`\x1b[33m[${step}]\x1b[0m '${command.descr}'...`);
      execSync(command.cmd, { stdio: 'ignore' });
    } catch (e) {
      console.log(`\x1b[31m[ERRO]\x1b[0m Erro ao executar '${command.cmd}'...`);
      break;
    }
  }
};

const commands = [
  {
    descr: 'Mudando para a branch master',
    cmd: 'git checkout master',
  },
  {
    descr: `Fazendo build da versão atual: ${appManifest.version}`,
    cmd: 'npm run webpack:prod',
  },
  {
    descr: 'Compactando o path',
    cmd: `cd ${appPath} && mkdir -p ${outputPath} && zip -r "${outputPath}/sei-trello_v${appManifest.version}.zip" ./`,
  },
  {
    descr: 'Setando tag desta versão',
    cmd: `git tag ${appManifest.version}`,
  },
  {
    descr: 'Sincronizando git local com remote...',
    cmd: 'git push --tags origin master dev',
  },
];

runCommands(commands);
