export const extractRelevantDataFromRow = (row) => {

  let data = {};

  const noteAnchor = row.querySelector('a[href^="controlador.php?acao=anotacao_registrar"]');
  if (noteAnchor !== null) {
    const noteAnchorTooltipInfo = noteAnchor.getAttribute('onmouseover');
    if (noteAnchorTooltipInfo) {
      const noteAnchorInfoArray = noteAnchorTooltipInfo.split('\'');
      if (noteAnchorInfoArray.length === 5) data.noteDescription = noteAnchorInfoArray[1].replace(/\\r\\n/g, '\n');
    }
  }

  const processAnchor = row.querySelector('a[href^="controlador.php?acao=procedimento_trabalhar"]');
  if (processAnchor !== null) {
    const processAnchorTooltipInfo = processAnchor.getAttribute('onmouseover');
    if (processAnchorTooltipInfo) {
      const processAnchorInfoArray = processAnchorTooltipInfo.split('\'');
      if (processAnchorInfoArray.length === 5 && processAnchorInfoArray[1].length > 0) { 
        data.processSpecification = processAnchorInfoArray[1];
      }
    }
  }

  return data;
};
