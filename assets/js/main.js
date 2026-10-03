/* MD MECANIZADOS CNC S.L. · Interacciones de la web */
(function () {
  'use strict';

  // Dirección de destino de las solicitudes de presupuesto
  var CONTACT_EMAIL = 'info@mdmecanizadoscnc.es';

  document.documentElement.classList.remove('no-js');

  var header = document.querySelector('.header');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  /* ---------- Año del pie ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Cabecera con sombra al hacer scroll ---------- */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  function setNavTop() {
    if (!header) return;
    var bottom = header.getBoundingClientRect().bottom;
    document.documentElement.style.setProperty('--nav-top', Math.max(bottom, 0) + 'px');
  }
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      setNavTop();
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1200) closeNav();
    });
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]:not(.btn)'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Aparición progresiva ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      // Pequeño escalonado para elementos en la misma fila
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Formulario de solicitud ---------- */
  var form = document.getElementById('rfqForm');
  if (!form) return;

  var errorBox = document.getElementById('formError');
  var successBox = document.getElementById('formSuccess');
  var copyBtn = document.getElementById('copyRfq');
  var checksWrap = form.querySelector('.checks');
  var lastRequest = '';

  // Preselección del servicio al pulsar "Consultar este servicio"
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      var value = link.getAttribute('data-service');
      form.querySelectorAll('input[name="servicio"]').forEach(function (cb) {
        if (cb.value === value) cb.checked = true;
      });
      if (checksWrap) checksWrap.classList.remove('is-invalid');
    });
  });

  function val(name) {
    var el = form.elements[name];
    return el && el.value ? el.value.trim() : '';
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  function validate() {
    var ok = true;
    var firstInvalid = null;

    ['empresa', 'nombre', 'email', 'telefono', 'descripcion'].forEach(function (name) {
      var el = form.elements[name];
      var bad = !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.classList.toggle('is-invalid', bad);
      if (bad) { ok = false; firstInvalid = firstInvalid || el; }
    });

    var anyService = form.querySelectorAll('input[name="servicio"]:checked').length > 0;
    checksWrap.classList.toggle('is-invalid', !anyService);
    if (!anyService) { ok = false; firstInvalid = firstInvalid || checksWrap.querySelector('input'); }

    var priv = document.getElementById('f-priv');
    priv.closest('.check-inline').classList.toggle('is-invalid', !priv.checked);
    if (!priv.checked) { ok = false; firstInvalid = firstInvalid || priv; }

    if (!ok) {
      showError('Revise los campos marcados: empresa, contacto, email válido, teléfono, al menos un servicio, descripción y aceptación de la política de privacidad.');
      if (firstInvalid) firstInvalid.focus({ preventScroll: false });
    }
    return ok;
  }

  form.addEventListener('input', function (e) {
    if (e.target.classList) e.target.classList.remove('is-invalid');
    if (e.target.name === 'servicio') checksWrap.classList.remove('is-invalid');
    if (e.target.id === 'f-priv') e.target.closest('.check-inline').classList.remove('is-invalid');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.hidden = true;
    successBox.hidden = true;
    if (!validate()) return;

    var services = Array.prototype.map.call(
      form.querySelectorAll('input[name="servicio"]:checked'),
      function (cb) { return cb.value; }
    );
    var nda = document.getElementById('f-nda').checked;

    var lines = [
      'SOLICITUD DE PRESUPUESTO',
      '========================',
      '',
      'Empresa: ' + val('empresa'),
      'Persona de contacto: ' + val('nombre'),
      'Departamento / cargo: ' + (val('cargo') || '-'),
      'Email: ' + val('email'),
      'Teléfono: ' + val('telefono'),
      'Sector: ' + (val('sector') || '-'),
      '',
      'Servicios de interés: ' + services.join(', '),
      'Cantidad estimada: ' + (val('cantidad') || '-'),
      'Plazo deseado: ' + (val('plazo') || '-'),
      'Material: ' + (val('material') || '-'),
      'Requiere NDA previo: ' + (nda ? 'Sí' : 'No'),
      '',
      'Descripción del pedido:',
      val('descripcion'),
      '',
      '---',
      'Adjunto planos / modelos 3D (STEP, IGES, DWG, PDF…).'
    ];
    lastRequest = lines.join('\n');

    var subject = 'Solicitud de presupuesto - ' + val('empresa') + ' - ' + services[0] + (services.length > 1 ? ' (+' + (services.length - 1) + ')' : '');
    var href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lastRequest);

    window.location.href = href;
    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = 'Para: ' + CONTACT_EMAIL + '\n\n' + lastRequest;
      function done() { copyBtn.textContent = 'Copiado ✓'; setTimeout(function () { copyBtn.textContent = 'Copiar solicitud'; }, 2200); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* sin acción */ }
        document.body.removeChild(ta);
      }
    });
  }
})();
