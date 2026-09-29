/**
 * Cliente del frontend para el CRUD de Cerdos.
 * Consume la API REST (Node.js + Express + MySQL) con fetch.
 *
 * @author Aprendiz SENA
 */

const API_URL = '/api/cerdos';

// Referencias del DOM
const form = document.getElementById('formRegistroCerdo');
const tbody = document.querySelector('#tablaCerdos tbody');
const buscador = document.getElementById('buscarCerdo');
const tituloForm = document.getElementById('tituloFormCerdo');

// Estado: id del cerdo en edicion (null = modo crear)
let idEnEdicion = null;
// Cache de los cerdos cargados
let cerdosCache = [];

/**
 * Escapa texto para prevenir inyeccion de HTML.
 * @param {*} valor Valor a escapar.
 * @returns {string} Texto seguro.
 */
function escapar(valor) {
  if (valor === null || valor === undefined) return '';
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Calcula la edad en meses a partir de una fecha de nacimiento.
 * @param {string} fechaNacimiento Fecha en formato YYYY-MM-DD.
 * @returns {number|string} Edad en meses o cadena vacia.
 */
function calcularEdadMeses(fechaNacimiento) {
  if (!fechaNacimiento) return '';
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12;
  meses += hoy.getMonth() - nacimiento.getMonth();
  if (meses < 0) meses = 0;
  return meses;
}

/**
 * Devuelve el color segun el estado de salud.
 * @param {string} estado Estado del cerdo.
 * @returns {string} Color HEX.
 */
function colorEstado(estado) {
  const colores = {
    Excelente: '#27AE60',
    Estable: '#2E86C1',
    'En Tratamiento': '#E67E22',
    Activo: '#27AE60',
    Vendido: '#8E44AD',
    Crítico: '#C0392B',
  };
  return colores[estado] || '#555';
}

/**
 * Muestra un mensaje temporal al usuario.
 * @param {string} mensaje Texto a mostrar.
 * @param {boolean} esError Si es un mensaje de error.
 */
function notificar(mensaje, esError = false) {
  const alerta = document.createElement('div');
  alerta.textContent = mensaje;
  alerta.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    padding: 12px 20px; border-radius: 8px; color: #fff;
    background: ${esError ? '#C0392B' : '#27AE60'};
    box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-size: 14px;
  `;
  document.body.appendChild(alerta);
  setTimeout(() => alerta.remove(), 3000);
}

/**
 * Renderiza la tabla de cerdos.
 * @param {Array} cerdos Lista de cerdos.
 */
function renderizarTabla(cerdos) {
  if (!cerdos.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888;">No hay cerdos registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = cerdos
    .map(
      (c) => `
      <tr>
        <td># ${escapar(c.codigo)}</td>
        <td>${escapar(c.raza)}</td>
        <td>${escapar(c.sexo)}</td>
        <td>${escapar(calcularEdadMeses(c.fecha_nacimiento))}</td>
        <td>${escapar(c.peso_kg)}</td>
        <td><span style="color:${colorEstado(c.estado)};">● ${escapar(c.estado)}</span></td>
        <td>
          <button class="delete-btn" title="Editar" data-accion="editar" data-id="${c.id_cerdo}">✏️</button>
          <button class="delete-btn" title="Eliminar" data-accion="eliminar" data-id="${c.id_cerdo}">🗑️</button>
        </td>
      </tr>`
    )
    .join('');
}

/**
 * Carga los cerdos desde la API y refresca la tabla.
 */
async function cargarCerdos() {
  try {
    const respuesta = await fetch(API_URL);
    const json = await respuesta.json();
    cerdosCache = json.data || [];
    renderizarTabla(cerdosCache);
  } catch (error) {
    notificar('No se pudo conectar con el servidor', true);
    console.error(error);
  }
}

/**
 * Boton cancelar edicion.
 */
const btnCancelar = document.getElementById('btnCancelar');

/**
 * Limpia el formulario y vuelve al modo crear.
 */
function resetFormulario() {
  form.reset();
  idEnEdicion = null;
  tituloForm.textContent = '📝 Ficha de Registro';
  form.querySelector('button[type="submit"]').textContent = 'Guardar Registro';
  if (btnCancelar) btnCancelar.style.display = 'none';
}

/**
 * Maneja el submit del formulario (crear o actualizar).
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    codigo: document.getElementById('nombreCerdo').value.trim().toUpperCase(),
    raza: document.getElementById('raza').value,
    sexo: document.getElementById('sexo').value,
    fecha_nacimiento: document.getElementById('fechaNacimiento').value || null,
    peso_kg: parseFloat(document.getElementById('pesoActual').value) || null,
    estado: document.getElementById('estadoSalud').value,
  };

  try {
    let respuesta;
    if (idEnEdicion) {
      respuesta = await fetch(`${API_URL}/${idEnEdicion}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
    } else {
      respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
    }

    const json = await respuesta.json();

    if (!respuesta.ok) {
      notificar(json.mensaje || 'Ocurrio un error', true);
      return;
    }

    notificar(json.mensaje || 'Operacion exitosa');
    resetFormulario();
    cargarCerdos();
  } catch (error) {
    notificar('Error de conexion con el servidor', true);
    console.error(error);
  }
});

/**
 * Maneja los clicks en los botones de la tabla (editar / eliminar).
 */
tbody.addEventListener('click', async (e) => {
  const boton = e.target.closest('button[data-accion]');
  if (!boton) return;

  const id = boton.dataset.id;
  const accion = boton.dataset.accion;
  const cerdo = cerdosCache.find((c) => String(c.id_cerdo) === String(id));
  if (!cerdo) return;

  if (accion === 'eliminar') {
    if (!confirm(`¿Eliminar el cerdo ${cerdo.codigo}?`)) return;
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const json = await respuesta.json();
      if (!respuesta.ok) return notificar(json.mensaje || 'No se pudo eliminar', true);
      notificar('Cerdo eliminado correctamente');
      cargarCerdos();
    } catch (error) {
      notificar('Error de conexion', true);
    }
  }

  if (accion === 'editar') {
    idEnEdicion = id;
    document.getElementById('nombreCerdo').value = cerdo.codigo;
    document.getElementById('raza').value = cerdo.raza;
    document.getElementById('sexo').value = cerdo.sexo;
    document.getElementById('fechaNacimiento').value = (cerdo.fecha_nacimiento || '').substring(0, 10);
    document.getElementById('pesoActual').value = cerdo.peso_kg;
    document.getElementById('estadoSalud').value = cerdo.estado;
    tituloForm.textContent = '✏️ Editar Registro';
    form.querySelector('button[type="submit"]').textContent = 'Actualizar Registro';
    if (btnCancelar) btnCancelar.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/**
 * Filtro de busqueda en tiempo real.
 */
buscador.addEventListener('input', function () {
  const filtro = this.value.toLowerCase();
  const filas = tbody.querySelectorAll('tr');
  filas.forEach((fila) => {
    fila.style.display = fila.innerText.toLowerCase().includes(filtro) ? '' : 'none';
  });
});

/**
 * Boton cancelar: sale del modo edicion sin guardar.
 */
if (btnCancelar) {
  btnCancelar.addEventListener('click', resetFormulario);
}

// Carga inicial
cargarCerdos();
