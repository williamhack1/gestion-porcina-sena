/**
 * Middleware global para el manejo de errores.
 *
 * @author Aprendiz SENA
 */

// Middleware para rutas no encontradas (404)
function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

// Middleware de manejo de errores
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);

  // Error de llave duplicada en MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      ok: false,
      mensaje: 'El registro ya existe (valor duplicado)',
    });
  }

  res.status(err.status || 500).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor',
  });
}

module.exports = { notFoundHandler, errorHandler };
