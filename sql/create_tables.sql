-- Create table statements for Mandora Monitoring
create database mandora;
use mandora;

-- Use authentication plugin instead of caching_sha2_password 
CREATE USER 'mandora'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MyPassword';
GRANT ALL PRIVILEGES ON *.* TO 'mandora'@'localhost';

-- Location data of the object that's being monitored (anonymous)
CREATE TABLE `location`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(64) COMMENT 'External location representation (UUID)',
    `household_id` INT NOT NULL,
    `address_id` INT NOT NULL,
    `characteristics_id` INT,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`household_id`) REFERENCES `household`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`characteristics_id`) REFERENCES `characteristics`(`id`) ON DELETE CASCADE
);

INSERT INTO `location` 
    (`uuid`) 
VALUES 
    ('33a14796-d583-45a9-94ee-24594cf61561'),
    (),
    (),
    (),
    (),
    (),
    (),
    (),
    (),
    (), -- 10
    (),
    (),
    (),
    (),
    (),
    (),
    (),
    (),
    (), -- 20
    (),
    (),
    (),
    (),    
    ;


-- Installation and other relevant characteristics of the location (anonymous)
CREATE TABLE `characteristics` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `hasHeatpump` BOOL,
    `hasGasHeating` BOOL,
    `hasPV` BOOL,
    PRIMARY KEY (`id`),
);

-- Address information (protected)
CREATE TABLE `address` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `postalcode` VARCHAR(64) NOT NULL,
    `housenumber` VARCHAR(64) NOT NULL,
    `streetname` INT NOT NULL,
    `city` INT NOT NULL,
    PRIMARY KEY (`id`)
);

-- Household data (private)
CREATE TABLE `household` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `phonenumber` VARCHAR(255),
    `mandateItho` BOOLEAN NOT NULL DEFAULT 'true',
    `mandateSmartDodos` BOOLEAN NOT NULL DEFAULT 'true',
    PRIMARY KEY (`id`),
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

-- Password encryption (AES):
-- INSERT INTO `users` (`first_name`,`last_name`,`email`,`username`, `password`,`authorization_id`) values ('Test','User', 'test@ecowijkmandora.nl','test',AES_ENCRYPT('mypassword','MySecretKey'),1);
-- SELECT AES_DECRYPT(`password`,'MySecretKey') AS `password` FROM `users` WHERE `username` = 'test';

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

-- Insert authorization levels
INSERT INTO `authorization` 
    (`name`,`readonly`,`anonymous`,`protected`,`private`)
VALUES
    ('No access',1,0,0,0),
    ('Anonymous',1,1,0,0),
    ('Anonymous+Protected',1,1,1,0),
    ('Anonymous+Protected+Private',1,1,1,1),
    ('Anonymous+Protected+Private (RW)',0,1,1,1);