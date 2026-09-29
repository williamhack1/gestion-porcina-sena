# Sistema de Gestion Porcina - API REST

Modulo de software desarrollado con **Node.js + Express + MySQL (mysql2)** para la evidencia
**GA7-220501096-AA2-EV01 - Codificacion de modulos del software**.

El proyecto expone un CRUD completo para la entidad **Cerdos** y sirve el frontend
(HTML/CSS) desde la carpeta `public/`.

---

## Arquitectura

Patron **MVC** por capas:

```
src/
├── config/        Conexion a MySQL (pool de mysql2)
├── models/        Consultas SQL (acceso a datos)
├── controllers/   Logica de las peticiones HTTP
├── routes/        Definicion de endpoints REST
├── middlewares/   Manejo global de errores
└── app.js         Configuracion de Express
server.js          Punto de entrada
database/          Script SQL de la base de datos
public/            Frontend (HTML, CSS, imagenes)
```

---

## Requisitos

- Node.js 18+
- MySQL / MariaDB (incluido en XAMPP)

## Instalacion

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Proyecto
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Encender **MySQL** desde el panel de XAMPP.

4. Crear la base de datos ejecutando `database/script.sql`
   (desde phpMyAdmin o desde la consola de MySQL).

5. Configurar el archivo `.env` (tomar `.env.example` como base):
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=gestion_porcina
   ```

6. Ejecutar el servidor:
   ```bash
   npm run dev     # con nodemon (recarga automatica)
   # o
   npm start
   ```

7. Abrir en el navegador: http://localhost:3000

---

## Endpoints de la API (CRUD Cerdos)

| Metodo | Ruta                | Descripcion              |
|--------|---------------------|--------------------------|
| GET    | `/api/cerdos`       | Listar todos los cerdos  |
| GET    | `/api/cerdos/:id`   | Obtener un cerdo por id  |
| POST   | `/api/cerdos`       | Crear un cerdo           |
| PUT    | `/api/cerdos/:id`   | Actualizar un cerdo      |
| DELETE | `/api/cerdos/:id`   | Eliminar un cerdo        |
| GET    | `/api/health`       | Estado del servicio      |

### Ejemplo de cuerpo (POST / PUT)

```json
{
  "codigo": "CRD-010",
  "raza": "Landrace",
  "sexo": "Hembra",
  "fecha_nacimiento": "2024-05-01",
  "peso_kg": 88.5,
  "estado": "Activo",
  "observaciones": "Cerda reproductora"
}
```

---

## Autor

Aprendiz SENA - Analisis y Desarrollo de Software.
