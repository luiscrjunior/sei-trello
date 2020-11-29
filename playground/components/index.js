const requireModule = require.context('./', false, /\.js$/); //
const api = {};

requireModule.keys().forEach((fileName) => {
  if (fileName === './index.js') return;
  const moduleName = fileName.replace(/(\.\/|\.js)/g, '');
  api[moduleName] = requireModule(fileName).default;
});

export default api;
