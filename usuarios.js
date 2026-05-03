/* ═══════════════════════════════════════════
   DiseStock — usuarios.js
   ═══════════════════════════════════════════ */

let usuarios = [
  { id: 1, nombre: 'Luis Pérez',    correo: 'l.perez@disestock.com',  rol: 'Administrador', estado: 'Activo',   fecha: '10/01/2026', color: '#09afd5' },
  { id: 2, nombre: 'Ana Gómez',     correo: 'a.gomez@disestock.com',  rol: 'Auxiliar',      estado: 'Activo',   fecha: '15/01/2026', color: '#f26b49' },
  { id: 3, nombre: 'Carlos Díaz',   correo: 'c.diaz@disestock.com',   rol: 'Auxiliar',      estado: 'Inactivo', fecha: '20/02/2026', color: '#6c757d' },
  { id: 4, nombre: 'María Torres',  correo: 'm.torres@disestock.com', rol: 'Supervisor',    estado: 'Activo',   fecha: '05/03/2026', color: '#28a745' },
];
let nextId = 5;
let usuariosFiltrados = [...usuarios];

// ── Iniciales ──
function iniciales(nombre) {
  return nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// ── Badge rol ──
function badgeRol(rol) {
  const map = { 'Administrador': 'badge-admin', 'Supervisor': 'badge-supervisor', 'Auxiliar': 'badge-user' };
  return `<span class="badge ${map[rol] || 'badge-user'}">${rol}</span>`;
}

// ── Badge estado ──
function badgeEstado(estado) {
  return `<span class="badge ${estado === 'Activo' ? 'badge-active' : 'badge-inactive'}">${estado}</span>`;
}

// ── Renderizar tabla ──
function renderUsuarios() {
  const tbody = document.getElementById('tbodyUsuarios');
  tbody.innerHTML = usuariosFiltrados.map(u => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="avatar" style="background:${u.color}">${iniciales(u.nombre)}</div>
          <div>
            <div class="user-name">${escapeHtml(u.nombre)}</div>
            <div class="user-role">${u.rol}</div>
          </div>
        </div>
      </td>
      <td>${u.correo}</td>
      <td>${badgeRol(u.rol)}</td>
      <td>${badgeEstado(u.estado)}</td>
      <td>${u.fecha}</td>
      <td>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="editarUsuario(${u.id})" aria-label="Editar usuario">Editar</button>
          <button class="btn btn-danger btn-sm"    onclick="eliminarUsuario(${u.id})" aria-label="Eliminar usuario">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Filtrar ──
function filtrarUsuarios() {
  const q = document.getElementById('buscarUsuario').value.toLowerCase();
  usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(q) ||
    u.correo.toLowerCase().includes(q) ||
    u.rol.toLowerCase().includes(q)
  );
  renderUsuarios();
}

// ── Modal ──
const COLORES = ['#09afd5','#f26b49','#28a745','#6c757d','#fd7e14','#6610f2','#e83e8c'];

function abrirModalUsuario(id = null) {
  const modal  = document.getElementById('modalUsuario');
  const titulo = document.getElementById('modalUsuarioTitulo');
  document.getElementById('formUsuario').reset();
  document.getElementById('editUserId').value = '';

  if (id) {
    const u = usuarios.find(x => x.id === id);
    if (!u) return;
    titulo.textContent = 'Editar usuario';
    document.getElementById('editUserId').value = id;
    document.getElementById('uNombre').value  = u.nombre;
    document.getElementById('uCorreo').value  = u.correo;
    document.getElementById('uRol').value     = u.rol;
    document.getElementById('uEstado').value  = u.estado;
  } else {
    titulo.textContent = 'Nuevo usuario';
  }
  modal.classList.add('open');
  document.getElementById('uNombre').focus();
}

function cerrarModalUsuario() {
  document.getElementById('modalUsuario').classList.remove('open');
}

function editarUsuario(id)    { abrirModalUsuario(id); }

function eliminarUsuario(id) {
  const u = usuarios.find(x => x.id === id);
  if (!u) return;
  if (confirm(`¿Eliminar al usuario "${u.nombre}"?`)) {
    usuarios = usuarios.filter(x => x.id !== id);
    filtrarUsuarios();
    showAlert(`Usuario "${u.nombre}" eliminado.`, 'success');
  }
}

// ── Guardar ──
document.getElementById('formUsuario').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre  = document.getElementById('uNombre').value.trim();
  const correo  = document.getElementById('uCorreo').value.trim();
  const rol     = document.getElementById('uRol').value;
  const estado  = document.getElementById('uEstado').value;
  const editId  = document.getElementById('editUserId').value;

  if (!nombre || !correo || !rol) {
    showAlert('Por favor completa todos los campos.', 'error');
    return;
  }

  if (editId) {
    const idx = usuarios.findIndex(x => x.id === parseInt(editId));
    usuarios[idx] = { ...usuarios[idx], nombre, correo, rol, estado };
    showAlert(`Usuario "${nombre}" actualizado.`, 'success');
  } else {
    usuarios.push({
      id: nextId++, nombre, correo, rol, estado,
      fecha: formatDate(),
      color: COLORES[nextId % COLORES.length]
    });
    showAlert(`Usuario "${nombre}" creado correctamente.`, 'success');
  }

  cerrarModalUsuario();
  filtrarUsuarios();
});

// ── Cerrar al hacer clic fuera ──
document.getElementById('modalUsuario').addEventListener('click', function(e) {
  if (e.target === this) cerrarModalUsuario();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModalUsuario(); });

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──
renderUsuarios();
