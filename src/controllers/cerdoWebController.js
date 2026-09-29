/**
 * Controlador web de la entidad Cerdo.
 * Maneja formularios HTML tradicionales (GET y POST) y renderiza vistas EJS.
 *
 * Este controlador es el equivalente en Node.js a un Servlet + JSP en Java:
 *  - GET  -> muestra el formulario y la tabla (renderizado con EJS)
 *  - POST -> procesa el formulario (insertar, actualizar, eliminar) y redirige
 *
 * @author Aprendiz SENA
 */

const cerdoModel = require('../models/cerdoModel');

/**
 * GET /cerdos
 * Lista todos los cerdos y muestra la pagina principal.
 */
async function listar(req, res, next) {
  try {
    const cerdos = await cerdoModel.listarCerdos();
    res.render('cerdos', {
      titulo: 'Registro de Cerdos',
      cerdos,
      cerdoEditar: null,
      mensaje: req.query.mensaje || null,
      error: req.query.error || null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /cerdos/editar/:id
 * Muestra el formulario cargado con los datos de un cerdo para editarlo.
 */
async function mostrarEditar(req, res, next) {
  try {
    const { id } = req.params;
    const cerdoEditar = await cerdoModel.obtenerCerdoPorId(id);

    if (!cerdoEditar) {
      return res.redirect('/cerdos?error=Cerdo no encontrado');
    }

    const cerdos = await cerdoModel.listarCerdos();
    res.render('cerdos', {
      titulo: 'Editar Cerdo',
      cerdos,
      cerdoEditar,
      mensaje: null,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /cerdos/guardar
 * Inserta un nuevo cerdo (si no hay id) o actualiza uno existente (si hay id).
 */
async function guardar(req, res, next) {
  try {
    const { id_cerdo, codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones } = req.body;

    // Validaciones basicas
    if (!codigo || !raza || !sexo) {
      return res.redirect('/cerdos?error=Los campos codigo, raza y sexo son obligatorios');
    }

    const datos = {
      codigo: codigo.trim().toUpperCase(),
      raza,
      sexo,
      fecha_nacimiento: fecha_nacimiento || null,
      peso_kg: peso_kg || null,
      estado: estado || 'Activo',
      observaciones: observaciones || null,
    };

    if (id_cerdo) {
      // Actualizar
      await cerdoModel.actualizarCerdo(id_cerdo, datos);
      return res.redirect('/cerdos?mensaje=Cerdo actualizado correctamente');
    }

    // Insertar: verificar codigo duplicado
    const existente = await cerdoModel.obtenerCerdoPorCodigo(datos.codigo);
    if (existente) {
      return res.redirect(`/cerdos?error=El codigo ${datos.codigo} ya esta registrado`);
    }

    await cerdoModel.crearCerdo(datos);
    res.redirect('/cerdos?mensaje=Cerdo registrado correctamente');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /cerdos/eliminar/:id
 * Elimina un cerdo y redirige a la lista.
 */
async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    await cerdoModel.eliminarCerdo(id);
    res.redirect('/cerdos?mensaje=Cerdo eliminado correctamente');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  mostrarEditar,
  guardar,
  eliminar,
};
