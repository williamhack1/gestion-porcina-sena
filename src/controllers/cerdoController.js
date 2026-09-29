/**
 * Controlador de la entidad Cerdo.
 * Gestiona las peticiones HTTP y delega la logica al modelo.
 *
 * @author Aprendiz SENA
 */

const cerdoModel = require('../models/cerdoModel');

/**
 * GET /api/cerdos
 * Lista todos los cerdos.
 */
async function listarCerdos(req, res, next) {
  try {
    const cerdos = await cerdoModel.listarCerdos();
    res.json({ ok: true, data: cerdos });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/cerdos/:id
 * Obtiene un cerdo por id.
 */
async function obtenerCerdo(req, res, next) {
  try {
    const { id } = req.params;
    const cerdo = await cerdoModel.obtenerCerdoPorId(id);
    if (!cerdo) {
      return res.status(404).json({ ok: false, mensaje: 'Cerdo no encontrado' });
    }
    res.json({ ok: true, data: cerdo });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cerdos
 * Crea un nuevo cerdo.
 */
async function crearCerdo(req, res, next) {
  try {
    const { codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones } = req.body;

    // Validaciones basicas
    if (!codigo || !raza || !sexo) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Los campos codigo, raza y sexo son obligatorios',
      });
    }

    // Verifica que el codigo no exista
    const existente = await cerdoModel.obtenerCerdoPorCodigo(codigo);
    if (existente) {
      return res.status(409).json({
        ok: false,
        mensaje: `El codigo ${codigo} ya esta registrado`,
      });
    }

    const idGenerado = await cerdoModel.crearCerdo({
      codigo,
      raza,
      sexo,
      fecha_nacimiento: fecha_nacimiento || null,
      peso_kg: peso_kg || null,
      estado: estado || 'Activo',
      observaciones: observaciones || null,
    });

    res.status(201).json({
      ok: true,
      mensaje: 'Cerdo creado correctamente',
      data: { id_cerdo: idGenerado },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/cerdos/:id
 * Actualiza un cerdo existente.
 */
async function actualizarCerdo(req, res, next) {
  try {
    const { id } = req.params;
    const { codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones } = req.body;

    const cerdo = await cerdoModel.obtenerCerdoPorId(id);
    if (!cerdo) {
      return res.status(404).json({ ok: false, mensaje: 'Cerdo no encontrado' });
    }

    if (!codigo || !raza || !sexo) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Los campos codigo, raza y sexo son obligatorios',
      });
    }

    const filas = await cerdoModel.actualizarCerdo(id, {
      codigo,
      raza,
      sexo,
      fecha_nacimiento: fecha_nacimiento || null,
      peso_kg: peso_kg || null,
      estado: estado || 'Activo',
      observaciones: observaciones || null,
    });

    res.json({
      ok: true,
      mensaje: 'Cerdo actualizado correctamente',
      data: { filasAfectadas: filas },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/cerdos/:id
 * Elimina un cerdo.
 */
async function eliminarCerdo(req, res, next) {
  try {
    const { id } = req.params;
    const filas = await cerdoModel.eliminarCerdo(id);

    if (filas === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Cerdo no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Cerdo eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarCerdos,
  obtenerCerdo,
  crearCerdo,
  actualizarCerdo,
  eliminarCerdo,
};
