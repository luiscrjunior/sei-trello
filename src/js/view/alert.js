import swal from 'sweetalert';

const alert = (type, text) => {
  const manifestInfo = chrome.runtime.getManifest();
  swal({
    title: manifestInfo.name,
    icon: type,
    text: text,
  });
};

export const error = (text) => {
  alert('error', text);
};
