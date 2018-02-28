CREATE DATABASE IF NOT EXISTS `sport_project`;

USE sport_project;

CREATE TABLE IF NOT EXISTS `product_table` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL UNIQUE,
  `barcode_id` varchar(255) NOT NULL UNIQUE,
  `is_doping` ENUM('false', 'true') NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE IF NOT EXISTS `barcode_info` (
--   `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
--   `product_barcode_id` int(11) NOT NULL UNIQUE,
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO product_table (id, name, barcode_id, is_doping)
VALUES (1, 'Prevention de reference', '37504100308632', 'false');

INSERT INTO product_table (id, name, barcode_id, is_doping)
VALUES (2, 'Le management des situation', '37504100337979', 'true');

INSERT INTO product_table (id, name, barcode_id, is_doping)
VALUES (3, 'La gestion des risques', '37504101522058', 'false');
