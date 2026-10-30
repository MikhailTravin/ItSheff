function loadSwaggerUI(userOptions) {
  userOptions = userOptions || {};

  var swaggerElement = document.getElementById('swagger-ui');
  if (!swaggerElement) return;

  var spec = null;
  var dataElement = document.getElementById('swagger-data');
  if (dataElement) {
    try {
      var data = JSON.parse(dataElement.textContent || '{}');
      spec = data.spec || data;
    } catch (e) {
      console.error('Swagger specification parse error:', e);
    }
  }

  var CleanPlugin = function () {
    var Empty = function () { return null; };
    return {
      wrapComponents: {
        InfoContainer: function () { return Empty; },
        info: function () { return Empty; },
        Models: function () { return Empty; },
        ModelCollapse: function (Orig) { return Orig; },
        ServersContainer: function () { return Empty; },
        AuthorizeBtn: function () { return Empty; },
        authorizeBtn: function () { return Empty; }
      }
    };
  };

  var options = {
    dom_id: '#swagger-ui',
    validatorUrl: null,
    deepLinking: false,
    docExpansion: 'list',
    defaultModelsExpandDepth: -1,
    displayRequestDuration: true,
    tryItOutEnabled: false,
    syntaxHighlight: { theme: 'monokai' },
    presets: [SwaggerUIBundle.presets.apis],
    plugins: [CleanPlugin],
    layout: 'BaseLayout'
  };

  if (spec && typeof spec === 'object' && Object.keys(spec).length) {
    options.spec = spec;
  } else if (userOptions.url) {
    options.url = userOptions.url;
  }
  Object.keys(userOptions).forEach(function (k) { options[k] = userOptions[k]; });

  window.ui = SwaggerUIBundle(options);

  var COPY_ICON =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M1.34333 11.9475C1.08779 11.8018 0.875227 11.5912 0.727146 11.3371C0.579065 11.0829 0.500709 10.7942 0.5 10.5V2.16667C0.5 1.25 1.25 0.5 2.16667 0.5H10.5C11.125 0.5 11.465 0.820833 11.75 1.33333M3.83333 6.05583C3.83333 5.46639 4.06749 4.90109 4.48429 4.48429C4.90109 4.06749 5.46639 3.83333 6.05583 3.83333H13.2775C13.5694 3.83333 13.8584 3.89082 14.128 4.00251C14.3977 4.1142 14.6427 4.27791 14.849 4.48429C15.0554 4.69067 15.2191 4.93567 15.3308 5.20532C15.4425 5.47497 15.5 5.76397 15.5 6.05583V13.2775C15.5 13.5694 15.4425 13.8584 15.3308 14.128C15.2191 14.3977 15.0554 14.6427 14.849 14.849C14.6427 15.0554 14.3977 15.2191 14.128 15.3308C13.8584 15.4425 13.5694 15.5 13.2775 15.5H6.05583C5.76397 15.5 5.47497 15.4425 5.20532 15.3308C4.93567 15.2191 4.69067 15.0554 4.48429 14.849C4.27791 14.6427 4.1142 14.3977 4.00251 14.128C3.89082 13.8584 3.83333 13.5694 3.83333 13.2775V6.05583Z" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  var OK_ICON =
    '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M3 8.5l3.2 3.2L13 4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  var TOAST_CLASS = options.toastClass || 'btn-sent';
  var TOAST_ACTIVE = options.toastActiveClass || 'btn-sent-open';
  var TOAST_MS = options.toastDuration || 3000;
  var TOAST_PARENT = options.toastContainer || 'main';
  var toastEl = null, toastTimer = null;

  function showToast(method) {
    if (!toastEl) {
      toastEl = document.querySelector('.' + TOAST_CLASS);
      if (!toastEl) {
        var wrap = document.createElement('div');
        wrap.className = TOAST_CLASS + 's';
        toastEl = document.createElement('div');
        toastEl.className = TOAST_CLASS + ' api-toast';
        wrap.appendChild(toastEl);
        (document.querySelector(TOAST_PARENT) || document.body).appendChild(wrap);
      }
    }
    toastEl.innerHTML = '<b>' + method + '</b> - Текст скопирован';
    toastEl.classList.add(TOAST_ACTIVE);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove(TOAST_ACTIVE);
    }, TOAST_MS);
  }

  function decorate() {
    var paths = swaggerElement.querySelectorAll('.opblock-summary-path:not([data-copy-ready])');
    paths.forEach(function (pathEl) {
      pathEl.setAttribute('data-copy-ready', '1');

      pathEl.querySelectorAll('.copy-to-clipboard').forEach(function (n) { n.remove(); });

      var text = (pathEl.getAttribute('data-path') || pathEl.textContent || '').trim();
      var btn = document.createElement('span');
      btn.className = 'api-copy';
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('aria-label', 'Скопировать путь');
      btn.setAttribute('title', 'Скопировать');
      btn.innerHTML = COPY_ICON;

      function doCopy(e) {
        e.preventDefault();
        e.stopPropagation();
        copyText(text).then(function () {
          var block = btn.closest('.opblock');
          var m = block && block.querySelector('.opblock-summary-method');
          showToast(m ? m.textContent.trim() : '');
          btn.classList.add('is-copied');
          btn.innerHTML = OK_ICON;
          clearTimeout(btn._t);
          btn._t = setTimeout(function () {
            btn.classList.remove('is-copied');
            btn.innerHTML = COPY_ICON;
          }, 1400);
        });
      }

      function stopAll(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      btn.addEventListener('mousedown', stopAll);
      btn.addEventListener('pointerdown', stopAll);
      btn.addEventListener('touchstart', stopAll, { passive: false });
      btn.addEventListener('click', doCopy);
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') doCopy(e);
      });

      var group = document.createElement('span');
      group.className = 'api-path-group';

      group.addEventListener('mousedown', stopAll);
      group.addEventListener('pointerdown', stopAll);
      group.addEventListener('touchstart', stopAll, { passive: false });
      group.addEventListener('click', stopAll);

      pathEl.parentNode.insertBefore(group, pathEl);
      group.appendChild(pathEl);
      group.appendChild(btn);
    });
  }

  new MutationObserver(decorate).observe(swaggerElement, { childList: true, subtree: true });
  decorate();
}