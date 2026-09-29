/**
 * Configuracion de la conexion a la base de datos MySQL.
 * Se utiliza mysql2/promise para trabajar con async/await.
 *
 * @author Aprendiz SENA
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones: reutiliza conexiones para mejorar el rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_porcina',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Verifica que la conexion a la base de datos funcione.
 * @returns {Promise<void>}
 */
async function probarConexion() {
  const conexion = await pool.getConnection();
  console.log('Conexion a la base de datos MySQL establecida correctamente.');
  conexion.release();
}

module.exports = { pool, probarConexion };
