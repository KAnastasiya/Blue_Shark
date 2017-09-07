if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serwiceWorker.js')
    .then(reg => {
      console.info(`Registration succeeded. Scope is ${reg.scope}`);
    })
    .catch(error => {
      console.error(`Registration failed with ${error}`);
    });
}
