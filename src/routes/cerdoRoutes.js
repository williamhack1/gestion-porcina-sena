/**
 * Rutas de la entidad Cerdo.
 * Define los endpoints REST para el CRUD de cerdos.
 *
 * @author Aprendiz SENA
 */

const express = require('express');
const cerdoController = require('../controllers/cerdoController');

const router = express.Router();

// GET /api/cerdos -> listar todos
router.get('/', cerdoController.listarCerdos);

// GET /api/cerdos/:id -> obtener uno
router.get('/:id', cerdoController.obtenerCerdo);

// POST /api/cerdos -> crear
router.post('/', cerdoController.crearCerdo);

// PUT /api/cerdos/:id -> actualizar
router.put('/:id', cerdoController.actualizarCerdo);

// DELETE /api/cerdos/:id -> eliminar
router.delete('/:id', cerdoController.eliminarCerdo);

module.exports = router;
