/* ═══════════════════════════════════════════
   DiseStock — solicitudes.js
   ═══════════════════════════════════════════ */

let solicitudes = [
  { id: 1, material: 'Cable eléctrico calibre 12', cantidad: 30, unidad: 'metros',   solicitante: 'Juan Pérez',     area: 'Taller eléctrico',  tipo: 'Préstamo temporal',   estado: 'Pendiente',  fecha: '04/04/2026' },
  { id: 2, material: 'Guantes dieléctricos',       cantidad: 2,  unidad: 'pares',    solicitante: 'Ana Gómez',      area: 'Mantenimiento',     tipo: 'Préstamo temporal',   estado: 'Aprobada',   fecha: '03/04/2026' },
  { id: 3, material: 'Taladro percutor 500W',      cantidad: 1,  unidad: 'unidades', solicitante: 'Carlos Díaz',    area: 'Infraestructura',   tipo: 'Préstamo temporal',   estado: 'Aprobada',   fecha: '02/04/2026' },
  { id: 4, material: 'Tubería conduit 3/4"',       cantidad: 5,  unidad: 'tramos',   solicitante: 'María Torres',   area: 'Taller eléctrico',  tipo: 'Consumo definitivo',  estado: 'Rechazada',  fecha: '01/04/2026' },
  { id: 5, material: 'Cinta aislante',             cantidad: 10, unidad: 'unidades', solicitante: 'Luis Fernández', area: 'Mantenimiento',     tipo: 'Consumo definitivo',  estado: 'Pendiente',  fecha: '31/03/2026' },
];
let nextId = 6;

// ── Badge por estado ──
function badgeEstado(estado) {
  const map = { 'Pendiente': 'badge-pending', 'Aprobada': 'badge-approved', 'Rechazada': 'badge-rejected' };
  return `<span class="badge ${map[estado] || 'badge-pending'}">${estado}</span>`;
}

// ── Renderizar lista ──
function renderSolicitudes() {
  const lista = document.getElementById('listaSolicitudes');
  if (!lista) return;
  lista.innerHTML = solicitudes.map(s => `
    <li class="sol-item">
      <div class="sol-info">
        <strong>${s.material} — ${s.cantidad} ${s.unidad}</strong>
        <span>Solicitante: ${s.solicitante} · ${s.area} · ${s.fecha}</span>
      </div>
      ${badgeEstado(s.estado)}
    </li>
  `).join('');
}

// ── Limpiar formulario ──
function limpiarForm() {
  document.getElementById('formSolicitud').reset();
}

// ── Enviar solicitud ──
document.getElementById('formSolicitud').addEventListener('submit', function(e) {
  e.preventDefault();
  const solicitante = document.getElementById('solicitante').value.trim();
  const area        = document.getElementById('area').value.trim();
  const material    = document.getElementById('material').value;
  const cantidad    = parseInt(document.getElementById('cantidad').value);
  const tipo        = document.getElementById('tipoSolicitud').value;
  const just        = document.getElementById('justificacion').value.trim();

  if (!solicitante || !area || !material || !cantidad || !just) {
    showAlert('Por favor completa todos los campos del formulario.', 'error');
    return;
  }

  solicitudes.unshift({
    id: nextId++, material, cantidad, unidad: 'unidades',
    solicitante, area, tipo, estado: 'Pendiente', fecha: formatDate()
  });

  renderSolicitudes();
  limpiarForm();
  showAlert('Solicitud enviada correctamente. Queda en estado Pendiente.', 'success');
});

// ── Init ──
renderSolicitudes();
