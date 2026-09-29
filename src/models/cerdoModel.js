/**
 * Modelo de la entidad Cerdo.
 * Contiene las operaciones CRUD contra la tabla `cerdos`.
 *
 * @author Aprendiz SENA
 */

const { pool } = require('../config/db');

/**
 * Obtiene todos los cerdos registrados.
 * @returns {Promise<Array>} Lista de cerdos.
 */
async function listarCerdos() {
  const [filas] = await pool.query(
    'SELECT * FROM cerdos ORDER BY id_cerdo DESC'
  );
  return filas;
}

/**
 * Obtiene un cerdo por su identificador.
 * @param {number} id Identificador del cerdo.
 * @returns {Promise<Object|null>} El cerdo encontrado o null.
 */
async function obtenerCerdoPorId(id) {
  const [filas] = await pool.query(
    'SELECT * FROM cerdos WHERE id_cerdo = ?',
    [id]
  );
  return filas[0] || null;
}

/**
 * Obtiene un cerdo por su codigo unico (ej: CRD-001).
 * @param {string} codigo Codigo del cerdo.
 * @returns {Promise<Object|null>} El cerdo encontrado o null.
 */
async function obtenerCerdoPorCodigo(codigo) {
  const [filas] = await pool.query(
    'SELECT * FROM cerdos WHERE codigo = ?',
    [codigo]
  );
  return filas[0] || null;
}

/**
 * Crea un nuevo cerdo.
 * @param {Object} cerdo Datos del cerdo.
 * @returns {Promise<number>} Id generado.
 */
async function crearCerdo(cerdo) {
  const { codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones } = cerdo;
  const [resultado] = await pool.query(
    `INSERT INTO cerdos
      (codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones]
  );
  return resultado.insertId;
}

/**
 * Actualiza un cerdo existente.
 * @param {number} id Identificador del cerdo.
 * @param {Object} cerdo Datos a actualizar.
 * @returns {Promise<number>} Filas afectadas.
 */
async function actualizarCerdo(id, cerdo) {
  const { codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones } = cerdo;
  const [resultado] = await pool.query(
    `UPDATE cerdos
        SET codigo = ?, raza = ?, sexo = ?, fecha_nacimiento = ?,
            peso_kg = ?, estado = ?, observaciones = ?
      WHERE id_cerdo = ?`,
    [codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones, id]
  );
  return resultado.affectedRows;
}

/**
 * Elimina un cerdo por su identificador.
 * @param {number} id Identificador del cerdo.
 * @returns {Promise<number>} Filas afectadas.
 */
async function eliminarCerdo(id) {
  const [resultado] = await pool.query(
    'DELETE FROM cerdos WHERE id_cerdo = ?',
    [id]
  );
  return resultado.affectedRows;
}

module.exports = {
  listarCerdos,
  obtenerCerdoPorId,
  obtenerCerdoPorCodigo,
  crearCerdo,
  actualizarCerdo,
  eliminarCerdo,
};
