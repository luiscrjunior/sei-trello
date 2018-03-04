import swal from 'sweetalert';

const alert = (type, text) => {
  const manifestInfo = chrome.runtime.getManifest();
  swal({
    title: manifestInfo.name,
    icon: type,
    text: text,
  });
};

export const confirm = (text) => {
  return swal({
    title: 'Tem certeza?',
    text: text,
    icon: 'warning',
    buttons: ['Não', 'Sim, remover!'],
    dangerMode: true,
  });
};

export const error = (text) => {
  alert('error', text);
};
