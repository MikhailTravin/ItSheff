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
    '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="5.25" y="5.25" width="8.5" height="8.5" rx="1.75" stroke="currentColor" stroke-width="1.4"/>' +
    '<path d="M10.75 3.5V3.25A1.75 1.75 0 0 0 9 1.5H3.75A1.75 1.75 0 0 0 2 3.25V9a1.75 1.75 0 0 0 1.75 1.75H4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
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
      btn.addEventListener('click', doCopy);
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') doCopy(e);
      });
      pathEl.appendChild(btn);
    });
  }

  new MutationObserver(decorate).observe(swaggerElement, { childList: true, subtree: true });
  decorate();
}