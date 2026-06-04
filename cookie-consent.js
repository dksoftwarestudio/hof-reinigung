(function () {
  var STORAGE_KEY = 'hof_reinigung_cookie_consent';
  var GA_ID = 'G-KQK9T328ZM';
  var CONSENT_ACCEPTED = 'accepted';
  var CONSENT_DECLINED = 'declined';

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      /* localStorage unavailable */
    }
  }

  function removeConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* localStorage unavailable */
    }
  }

  function loadGoogleAnalytics() {
    if (window.__hofReinigungGaLoaded) {
      return;
    }
    window.__hofReinigungGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
  }

  function hideBanner(banner) {
    if (banner && banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
  }

  function createBanner() {
    var banner = document.createElement('div');
    banner.className = 'hr-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.setAttribute('aria-live', 'polite');

    banner.innerHTML =
      '<div class="hr-cookie-banner__inner">' +
        '<p class="hr-cookie-banner__text">' +
          'Wir nutzen Google Analytics nur nach Ihrer Einwilligung, um die Nutzung dieser Website statistisch auszuwerten.' +
        '</p>' +
        '<div class="hr-cookie-banner__actions">' +
          '<a class="hr-cookie-banner__link" href="datenschutz.html">Cookie-Einstellungen</a>' +
          '<button type="button" class="hr-cookie-banner__btn hr-cookie-banner__btn--decline">Ablehnen</button>' +
          '<button type="button" class="hr-cookie-banner__btn hr-cookie-banner__btn--accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';

    banner.querySelector('.hr-cookie-banner__btn--accept').addEventListener('click', function () {
      setConsent(CONSENT_ACCEPTED);
      loadGoogleAnalytics();
      hideBanner(banner);
    });

    banner.querySelector('.hr-cookie-banner__btn--decline').addEventListener('click', function () {
      setConsent(CONSENT_DECLINED);
      hideBanner(banner);
    });

    var acceptButton = banner.querySelector('.hr-cookie-banner__btn--accept');
    window.requestAnimationFrame(function () {
      acceptButton && acceptButton.focus();
    });

    return banner;
  }

  function showBanner() {
    var existing = document.querySelector('.hr-cookie-banner');
    if (existing) {
      hideBanner(existing);
    }
    document.body.appendChild(createBanner());
  }

  function init() {
    var consent = getConsent();

    if (consent === CONSENT_ACCEPTED) {
      loadGoogleAnalytics();
      return;
    }

    if (consent === CONSENT_DECLINED) {
      return;
    }

    showBanner();
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-cookie-settings]');
    if (!trigger) {
      return;
    }

    event.preventDefault();
    removeConsent();
    showBanner();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
