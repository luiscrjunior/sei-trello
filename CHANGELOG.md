# Changelog
Todas mudanças do projeto estão documentadas neste arquivo.

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

## [1.0.0] - 18/02/2018 - Lançamento primeira versão