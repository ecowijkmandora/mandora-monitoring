-- Create table statements for Mandora Monitoring
create database mandora;
use mandora;

-- Use authentication plugin instead of caching_sha2_password 
CREATE USER 'mandora'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MyPassword';
GRANT ALL PRIVILEGES ON *.* TO 'mandora'@'localhost';

-- Address information (protected)
CREATE TABLE `address` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `postalcode` VARCHAR(10) NOT NULL,
    `housenumber` VARCHAR(10) NOT NULL,
    `streetname` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
);

-- Location data of the object that's being monitored (anonymous)
CREATE TABLE `location`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(64) COMMENT 'External location representation (UUID)',
    `address_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE CASCADE
);

CREATE TABLE `heatpump`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `brand` VARCHAR(64),
    `type` VARCHAR(64),
    PRIMARY KEY (`id`)
);

-- Installations in the house (protected)
CREATE TABLE `installation`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `ean_energy` VARCHAR(64),
    `ean_gas` VARCHAR(64),
    `serial_energymeter` VARCHAR(64),
    `heatpump_id` INT,
    `location_id` INT NOT NULL,    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE CASCADE,    
    FOREIGN KEY (`heatpump_id`) REFERENCES `heatpump`(`id`)
);
    
-- Mandates per partner (private)
-- CREATE TABLE `mandate`(
--     `id` INT NOT NULL AUTO_INCREMENT,
--     `itho` BOOL DEFAULT 0,
--     `smartdodos` BOOL DEFAULT 0,
--     `zevercloud` BOOL DEFAULT 0,    
--     `location_id` INT NOT NULL,
--     PRIMARY KEY (`id`),
--     FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON DELETE CASCADE    
-- );

-- User authorization table
CREATE TABLE `authorization` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) UNIQUE,
    `readonly` BOOL DEFAULT 1,
    `anonymous` BOOL DEFAULT 0,
    `protected` BOOL DEFAULT 0,
    `private` BOOL DEFAULT 0,
    PRIMARY KEY (`id`)
);

-- User authentication table
CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(100) NOT NULL,    
    `username` varchar(100) NOT NULL UNIQUE,    
    `password` blob NOT NULL,
    `first_name` varchar(100) NOT NULL,
    `last_name` varchar(100) NOT NULL,
    `active` BOOL DEFAULT 1,
    `authorization_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`authorization_id`) REFERENCES `authorization`(`id`)
);

