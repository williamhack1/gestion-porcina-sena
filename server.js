/**
 * Punto de entrada del servidor.
 * Levanta el servicio Express y verifica la conexion a MySQL.
 *
 * @author Aprendiz SENA
 */

require('dotenv').config();
const app = require('./src/app');
const { probarConexion } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await probarConexion();
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
    console.error('Verifica que MySQL (XAMPP) este encendido y las credenciales del archivo .env');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`API de cerdos: http://localhost:${PORT}/api/cerdos`);
  });
})();
