/* ═══════════════════════════════════════════
   DiseStock — app.js · Funciones globales
   ═══════════════════════════════════════════ */

// ── Cerrar sesión ──
function cerrarSesion() {
  if (confirm('¿Deseas cerrar sesión?')) {
    window.location.href = 'login.html';
  }
}

// ── Marcar enlace activo en navbar ──
function setActiveNav(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// ── Menú hamburguesa ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navRight  = document.getElementById('navRight');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    if (navRight) navRight.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  // Cerrar al hacer clic en un enlace
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (navRight) navRight.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }
}

// ── Mostrar alerta ──
function showAlert(msg, type = 'success', containerId = 'alertBox') {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.textContent = msg;
  box.className = `alert alert-${type} show`;
  setTimeout(() => { box.className = 'alert'; }, 3500);
}

// ── Formatear fecha ──
function formatDate(date = new Date()) {
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
