const Auth = () => {
  let APP_KEY = '';
  let APP_TOKEN = '';

  const getCredentials = () => ({
    key: APP_KEY,
    token: APP_TOKEN,
  });

  const setCredentials = (appKey, appToken) => {
    APP_KEY = appKey;
    APP_TOKEN = appToken;
  };

  return { getCredentials, setCredentials };
};

export default Auth();
