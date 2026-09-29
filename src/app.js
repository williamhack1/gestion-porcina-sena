/**
 * Configuracion principal de la aplicacion Express.
 *
 * @author Aprendiz SENA
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const cerdoRoutes = require('./routes/cerdoRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estaticos (HTML, CSS, imagenes) desde /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta de salud del servicio
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'API Sistema Porcino funcionando' });
});

// Rutas de la API
app.use('/api/cerdos', cerdoRoutes);

// Manejo de rutas no encontradas y errores
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
