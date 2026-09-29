/**
 * Rutas web (formularios HTML).
 * Usa metodos GET y POST, devuelve HTML renderizado con EJS.
 *
 * @author Aprendiz SENA
 */

const express = require('express');
const cerdoWebController = require('../controllers/cerdoWebController');

const router = express.Router();

// GET / -> redirige al listado de cerdos
router.get('/', (req, res) => res.redirect('/cerdos'));

// GET /cerdos -> listar (muestra formulario y tabla)
router.get('/cerdos', cerdoWebController.listar);

// GET /cerdos/editar/:id -> mostrar formulario de edicion
router.get('/cerdos/editar/:id', cerdoWebController.mostrarEditar);

// POST /cerdos/guardar -> insertar o actualizar
router.post('/cerdos/guardar', cerdoWebController.guardar);

// POST /cerdos/eliminar/:id -> eliminar
router.post('/cerdos/eliminar/:id', cerdoWebController.eliminar);

module.exports = router;
