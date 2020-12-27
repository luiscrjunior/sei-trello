# SEI+Trello

Extensão disponível para Chrome e Firefox que possibilita a integração entre o Sistema Eletrônico de Informações (SEI) e o Trello.

:blue_book: Leia a [documentação](https://luiscrjunior.github.io/sei-trello/) para saber mais detalhes.

:pencil: Acesse o [CHANGELOG](CHANGELOG.md) para conhecer as atualizações de cada versão.

## Quer apenas usar a extensão?

:arrow_right: Está usando o **Chrome**? Acesse a página da extensão na [na Chrome Web Store](https://chrome.google.com/webstore/detail/sei%2Btrello/dnjlkohajpocckjiddppmfhkpfdbkecl?hl=pt-BR). Clique em `Usar no Chrome` (canto superior direito) e, depois de instalada, configure-a na página de opções (credenciais e outras informações, tais como lista e quadro padrão) e pronto! Abra o SEI e seu Trello já estará integrado.

:arrow_right: Está usando o **Firefox**? Acesse a página da extensão [no Firefox Browser Add-Ons](https://addons.mozilla.org/pt-BR/firefox/addon/sei-trello/). Clique em `Adicionar ao Firefox` e, depois de instalada, configure-a na página de opções (credenciais e outras informações, tais como lista e quadro padrão) e pronto! Abra o SEI e seu Trello já estará integrado.


## Quer contribuir com o desenvolvimento?

A extensão está sendo mantida neste repositório e quem quiser colaborar, fique à vontade em submeter seu _pull request_.


### Tecnologias utilizadas

O código é escrito em `javascript` (todo ele em [`es6`](http://www.ecma-international.org/ecma-262/6.0/)), com transpilação para es5 via [`babel`](https://babeljs.io/). O gerenciador de pacotes é o [`npm`](https://www.npmjs.com/), o bundler é o [`webpack`](https://webpack.js.org/) e a renderização usa [`react`](https://reactjs.org/). Então, o desenvolvedor deve ter conhecimentos mínimos nessas ferramentas, além do `git`, claro.

### Requisito mínimo

`npm` instalado (de preferência uma versão recente).

### Ambiente de desenvolvimento

Para criar o ambiente de desenvolvimento, você deve primeiro clonar este repositório ou seu fork:

```
git clone git@github.com:luiscrjunior/sei-trello.git
```

Entre no diretório do repositório e faça um:

```
npm install
```

Isto irá instalar todos os pacotes listados no `package.json`, necessários ao funcionamento da aplicação.

A extensão ainda não foi gerada. Ela pode ser compilada com o comando:

```
npm run webpack:dev
```

Isto irá gerar o código da extensão no subdiretório `dist/expanded`.

Este diretório poderá ser incluído no Chrome na página de Gerenciamento de Extensões, no "Modo de desenvolvedor", como extensão expandida ("Carregar expansão expandida..."). No Firefox, carregue a extensão expandida nas configurações de Add-ons.

O comando `npm run webpack:dev:watch` monitora a mudança nos arquivos e compila em tempo real a cada modificação no código fonte.

Para gerar uma versão de produção, use o comando `npm run webpack:prod`. A versão final será minificada e o código morto (logs, debug) será eliminado.

_Obs.: não testei esse setup no Windows, apenas no linux. Os comandos provavelmente devem ser adaptados. Se alguém puder testar e documentar, agradeço._

### Testes

O projeto conta com testes unitários, de integração e end-to-end (com puppeteer). A cobertura não é total, mas abrangem as principais funcionalidades.

Gere o bundle para testes antes com `npm run webpack:test` (somente necessário para os testes e2e). Depois, para rodar todos os testes, execute `npm run test` para rodá-los. 

Você pode executar somente os testes unitários/integração com `npx jest --selectProjects 'Unit and Integration Tests'` e somente os testes e2e com `npx jest --selectProjects 'E2E Tests'`.

### Playground

O projeto conta com um ambiente preparado para esculpir os componentes React, com `HotModuleReplacementPlugin` e `ReactRefreshWebpackPlugin`, ou seja, os componentes atualizam automaticamente assim que o código é alterado. O ambiente é muito útil para construção dos componentes antes de usá-los como extensão e testar no SEI.

Execute `npm run playground` e abra seu navegador em `http://localhost:8080/`.

![Playground](/docs/playground.png)


### Regras para codificar

O projeto usa o `eslint` como linter e o `prettier` para formatação do código. As regras estão no arquivo `.eslintrc.js` e `.prettierrc.js`.

Todo o código é escrito em inglês, para manter um padrão. Os termos em português do SEI foram traduzidos livremente.
