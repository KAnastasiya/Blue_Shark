const page = document.querySelector('.parallax');

const setHeaderStyles = () => {
  let height, bg, shadow, logoAddText, navMobileBg, navFontColor;

  if (page.scrollTop >= 160) {
    height = '60px';
    bg = 'rgba(255, 255, 255, 0.95)';
    shadow = '-2px 1px 9px var(--color-primary--light)';
    logoAddText = 'var(--color-primary--light)';
    navMobileBg = '#e3f2fd';
    navFontColor = 'var(--color-gray)';
  } else {
    height = '135px';
    bg = 'transparent';
    shadow = 'none';
    logoAddText = 'var(--color-white)';
    navMobileBg = 'var(--color-white)';
    navFontColor = 'var(--color-white)';
  }

  const { body } = document;
  body.style.setProperty('--header-height', height);
  body.style.setProperty('--header-bg', bg);
  body.style.setProperty('--header-shadow', shadow);

  document.querySelector('.header__logo span').style.color = logoAddText;
  document.querySelector('x-navigation').style.setProperty('--nav-mobile-bg', navMobileBg);
  document.querySelector('x-navigation').style.setProperty('--nav-font-color', navFontColor);
};

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(reg => {
        console.info(`Registration succeeded. Scope is ${reg.scope}`);
      })
      .catch(error => {
        console.error(`Registration failed with ${error}`);
      });
  }
};

setHeaderStyles();
registerServiceWorker();
page.addEventListener('scroll', setHeaderStyles);
