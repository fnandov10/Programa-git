/* ═══════════════════════════════════════════
   DiseStock — inventario.js
   ═══════════════════════════════════════════ */

// Datos iniciales
let productos = [
  { id: 1, nombre: 'Cable eléctrico calibre 12', categoria: 'Materiales', cantidad: 150, unidad: 'metros' },
  { id: 2, nombre: 'Taladro percutor 500W',       categoria: 'Equipos',    cantidad: 4,   unidad: 'unidades' },
  { id: 3, nombre: 'Cinta aislante',              categoria: 'Materiales', cantidad: 0,   unidad: 'unidades' },
  { id: 4, nombre: 'Destornillador de pala',      categoria: 'Herramientas', cantidad: 22, unidad: 'unidades' },
  { id: 5, nombre: 'Guantes dieléctricos',        categoria: 'Equipos',    cantidad: 8,   unidad: 'pares' },
  { id: 6, nombre: 'Tubería conduit 3/4"',        categoria: 'Materiales', cantidad: 3,   unidad: 'tramos' },
  { id: 7, nombre: 'Alicate de presión',          categoria: 'Herramientas', cantidad: 12, unidad: 'unidades' },
  { id: 8, nombre: 'Multímetro digital',          categoria: 'Equipos',    cantidad: 5,   unidad: 'unidades' },
];

let nextId = 9;
let paginaActual = 1;
const POR_PAGINA = 6;
let productosFiltrados = [...productos];

// ── Estado del producto ──
function getEstado(cantidad) {
  if (cantidad === 0)  return { label: 'Agotado',    cls: 'badge-out' };
  if (cantidad <= 5)   return { label: 'Stock bajo',  cls: 'badge-low' };
  return { label: 'Disponible', cls: 'badge-ok' };
}

// ── Renderizar tabla ──
function renderTabla() {
  const tbody = document.getElementById('tbodyInventario');
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = productosFiltrados.slice(inicio, inicio + POR_PAGINA);
  const total  = productosFiltrados.length;

  tbody.innerHTML = pagina.map((p, i) => {
    const { label, cls } = getEstado(p.cantidad);
    return `<tr>
      <td>${String(inicio + i + 1).padStart(3, '0')}</td>
      <td>${escapeHtml(p.nombre)}</td>
      <td>${p.categoria}</td>
      <td><strong>${p.cantidad}</strong></td>
      <td>${p.unidad}</td>
      <td><span class="badge ${cls}">${label}</span></td>
      <td>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="editarProducto(${p.id})" aria-label="Editar ${escapeHtml(p.nombre)}">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})" aria-label="Eliminar ${escapeHtml(p.nombre)}">Eliminar</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  // Paginación
  const totalPaginas = Math.ceil(total / POR_PAGINA);
  document.getElementById('pageInfo').textContent = `Mostrando ${Math.min(inicio + POR_PAGINA, total)} de ${total} registros`;
  document.getElementById('prevBtn').disabled = paginaActual === 1;
  document.getElementById('nextBtn').disabled = paginaActual >= totalPaginas;

  let nums = '';
  for (let i = 1; i <= totalPaginas; i++) {
    nums += `<button class="page-btn${i === paginaActual ? ' active' : ''}" onclick="irAPagina(${i})">${i}</button>`;
  }
  document.getElementById('pageNums').innerHTML = nums;
}

function irAPagina(n) { paginaActual = n; renderTabla(); }
function cambiarPagina(delta) { paginaActual += delta; renderTabla(); }

// ── Filtrar ──
function filtrarTabla() {
  const q   = document.getElementById('buscador').value.toLowerCase();
  const cat = document.getElementById('filtroCategoria').value;
  productosFiltrados = productos.filter(p => {
    const matchQ   = p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
    const matchCat = !cat || p.categoria === cat;
    return matchQ && matchCat;
  });
  paginaActual = 1;
  renderTabla();
}

// ── Modal ──
function abrirModal(id = null) {
  const modal = document.getElementById('modalProducto');
  const titulo = document.getElementById('modalTitulo');
  document.getElementById('formProducto').reset();
  document.getElementById('editId').value = '';

  if (id) {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    titulo.textContent = 'Editar producto';
    document.getElementById('editId').value = id;
    document.getElementById('pNombre').value   = p.nombre;
    document.getElementById('pCategoria').value = p.categoria;
    document.getElementById('pCantidad').value  = p.cantidad;
    document.getElementById('pUnidad').value    = p.unidad;
  } else {
    titulo.textContent = 'Agregar producto';
  }
  modal.classList.add('open');
  document.getElementById('pNombre').focus();
}

function cerrarModal() {
  document.getElementById('modalProducto').classList.remove('open');
}

function editarProducto(id) { abrirModal(id); }

function eliminarProducto(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  if (confirm(`¿Eliminar "${p.nombre}"?`)) {
    productos = productos.filter(x => x.id !== id);
    filtrarTabla();
    showAlert(`"${p.nombre}" eliminado correctamente.`, 'success');
  }
}

// ── Guardar ──
document.getElementById('formProducto').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre    = document.getElementById('pNombre').value.trim();
  const categoria = document.getElementById('pCategoria').value;
  const cantidad  = parseInt(document.getElementById('pCantidad').value);
  const unidad    = document.getElementById('pUnidad').value.trim();
  const editId    = document.getElementById('editId').value;

  if (!nombre || !categoria || isNaN(cantidad) || !unidad) {
    showAlert('Por favor completa todos los campos.', 'error');
    return;
  }

  if (editId) {
    const idx = productos.findIndex(x => x.id === parseInt(editId));
    productos[idx] = { id: parseInt(editId), nombre, categoria, cantidad, unidad };
    showAlert(`"${nombre}" actualizado correctamente.`, 'success');
  } else {
    productos.push({ id: nextId++, nombre, categoria, cantidad, unidad });
    showAlert(`"${nombre}" agregado al inventario.`, 'success');
  }

  cerrarModal();
  filtrarTabla();
});

// ── Exportar CSV ──
function exportarCSV() {
  const headers = ['#', 'Nombre', 'Categoría', 'Cantidad', 'Unidad', 'Estado'];
  const rows = productos.map((p, i) => [
    i + 1, p.nombre, p.categoria, p.cantidad, p.unidad, getEstado(p.cantidad).label
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'inventario_disestock.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ── Cerrar modal al hacer clic fuera ──
document.getElementById('modalProducto').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});

// ── Escape para cerrar modal ──
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

// ── Escape HTML ──
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──
filtrarTabla();
