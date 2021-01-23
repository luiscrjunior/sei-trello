## [1.6.2] - 23/01/2021

- Pequenas melhorias e correções de bugs.

## [1.6.1] - 27/12/2020

- Pequenas melhorias e correções de bugs.

## [1.6] - 26/12/2020

- Possibilidade de selecionar, criar e editar etiquetas de dentro do SEI.
- Correções de bugs.

## [1.5] - 20/12/2020

- Primeira versão para Firefox (experimental).
- Correções de bugs.

## [1.4] - 06/12/2020

- Possibilidade de editar checklist (primeira versão da funcionalidade).
- Outras pequenas melhorias e correções de bugs.

## [1.3.10] - 20/11/2020

- Corrigido o bug de posicionamento do painel de especificação da data de entrega (estava por baixo dos elementos do SEI).
- Alterado o padrão de reconhecimento de número de protocolo do SEI para ser o mais abrangente possível.
- Outras pequenas melhorias.

## [1.3.9] - 06/04/2019

- Corrigido o bug de posicionamento das opções em quadros com destaque vermelho.
- Reconhece o formato de url do SEI de outras instituições: aquelas que possuem o /web no caminho (ex.: UFPR).

## [1.3.8] - 02/03/2019

- Corrigido o bug de o menu suspenso estar por baixo do número do processo (na tela de visualização do processo).
- Reconhece o formato de número de protocolo do MP/AM.

## [1.3.7] - 24/02/2019

- Corrigido o bug de incompatibilidade com o SEI versão 3.0.15+.

## [1.3.6] - 03/02/2019

- Reduzido o tamanho do calendário.
- Corrigido o bug de, em algumas ocasiões, encontrar outro quadro padrão, diferente do especificado nas configurações.
- Extẽnsão agora reconhece alguns protocolos de processos antigos.

## [1.3.5] - 08/06/2018

- Possibilidade de editar a data de entrega do cartão (e se ela foi concluída) de dentro do SEI.

## [1.3.4] - 04/06/2018

- Corrigido BUG de compatibilidade com a nova versão do SEI++, em relação à mensagem de filtro ligado.
- Corrigido BUG na aparência da lista de filtros (estava aparecendo um marcador indesejado ao lado de cada item).

## [1.3.3] - 22/04/2018

- O cartão também fica destacado em vermelho em caso de processo não visualizado.
- Adicionado filtro para selecionar apenas processos sem cartão vinculado.

## [1.3.2] - 11/03/2018

- Corrigido bug de remover cartão assim que se fazia uma atribuição em massa dos processos pela árvore.
- Corrigido bug de não mostrar erro quando se escolhia um quadro sem lista.
- Corrigido bug de não mostrar alguns quadros (corrigida forma de buscar).

## [1.3.1] - 11/03/2018

- Possibilidade de filtar por quadro/lista.
- Resolvido bug de não criar cartões de dentro do processo quando o protocolo está fora do padrão SEI.
- Possibilidade de editar a localização do cartão através de um menu suspenso (quadro e lista).

## [1.3.0] - 08/03/2018

- Implementado possibilidade de filtrar (botão filtro).

## [1.2.0] - 04/03/2018

- Implementado tooltip que esclarece a função de alguns botões.
- Aviso quando há mais de um cartão para o mesmo processo.
- Possibilidade de deletar cartão.
- Melhorada comunicação com a API do Trello ao atualizar cartões (cartões recém adicionados não estavam sincronizando).
- O cartão Trello agora aparece de dentro da visualização do processo.

## [1.1.0] - 25/02/2018

- Corrigido bug que mostrava erro quando o usuário possuía muitos quadros.
- Corrigido bug que mostrava erro quando havia um quadro compartilhado, que o usuário não era proprietário.
- Refatorado código que buscava os quadros, e isso fez com que aumentasse a velocidade de carregamento inicial.
- Alterada sutilmente a cor amarela das etiquetas para uma cor mais fácil de ler.
- Agora na página opções, o link para gerar o token é criado automaticamente na medida que o usuário informa a APP KEY.
- Mudança na forma de contagem da data. Agora considera dias apenas (ignora a hora informada no vencimento do cartão).
- Possibilidade de editar o cartão. Por enquanto, apenas o nome do cartão e a descrição.
- Outras melhorias no código.

## [1.0.0] - 18/02/2018

- Lançamento primeira versão
