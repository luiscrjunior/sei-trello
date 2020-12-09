window.chrome = {
  storage: {
    sync: {
      get: (data, fn) =>
        fn({
          appKey: 'key',
          appToken: 'token',
          defaultBoard: 'Quadro 1',
          defaultList: 'Lista 1',
        }),
    },
  },
  runtime: {
    getManifest: () => ({ name: 'sei+trello' }),
  },
};

window.infraTooltipMostrar = function () {
  console.log('infraTooltipMostrar');
};
