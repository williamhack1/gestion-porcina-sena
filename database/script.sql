-- ============================================================
-- Base de datos: Sistema de Gestion Porcina
-- Evidencia: GA7-220501096-AA2-EV01
-- Motor: MySQL / MariaDB (XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS gestion_porcina
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE gestion_porcina;

-- ------------------------------------------------------------
-- Tabla: cerdos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cerdos (
  id_cerdo          INT AUTO_INCREMENT PRIMARY KEY,
  codigo            VARCHAR(20)  NOT NULL UNIQUE,
  raza              VARCHAR(50)  NOT NULL,
  sexo              ENUM('Macho', 'Hembra') NOT NULL,
  fecha_nacimiento  DATE         NULL,
  peso_kg           DECIMAL(6,2) NULL,
  estado            VARCHAR(30)  NOT NULL DEFAULT 'Activo',
  observaciones     VARCHAR(255) NULL,
  creado_en         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Datos de ejemplo (coinciden con el dashboard)
-- ------------------------------------------------------------
INSERT INTO cerdos (codigo, raza, sexo, fecha_nacimiento, peso_kg, estado, observaciones) VALUES
  ('CRD-001', 'Yorkshire', 'Macho',  '2024-01-10', 110.50, 'Activo', 'Cerdo de engorde'),
  ('CRD-003', 'Duroc',     'Hembra', '2024-02-05',  95.00, 'Activo', 'Buena genetica'),
  ('CRD-005', 'Yorkshire', 'Macho',  '2024-02-20', 102.30, 'Activo', 'En revision medica');
