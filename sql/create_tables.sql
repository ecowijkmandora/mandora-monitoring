 -- Create table statements for Mandora monitoring tables
 
 -- House data
 -- This represents the object that's being monitored
 CREATE TABLE `House` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`uuid` VARCHAR(64) COMMENT 'External house representation (UUID)',
    `household_id` INT NOT NULL,
    `address_id` INT NOT NULL,
    `housedetails_id` INT,
	PRIMARY KEY (`id`),
    FOREIGN KEY (`installation_id`) 
        REFERENCES Installation(`id`) 
        ON DELETE CASCADE,
    FOREIGN KEY (`household_id`) 
        REFERENCES Household(`id`) 
        ON DELETE CASCADE,
    FOREIGN KEY (`address_id`) 
        REFERENCES Address(`id`) 
        ON DELETE CASCADE
);

-- Installation data
-- Properties of the installation and relevant characteristics of the house
CREATE TABLE `Installation` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`hasHeatpump` BOOL,
    `hasGasHeating` BOOL,
    `hasPV` BOOL,
	PRIMARY KEY (`id`),
);

-- Household data (private)
-- Detais of the house owner
CREATE TABLE `Household` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
    `phonenumber` VARCHAR(255),
    `mandateItho` BOOLEAN NOT NULL DEFAULT 'true',
    `mandateSmartDodos` BOOLEAN NOT NULL DEFAULT 'true',
	PRIMARY KEY (`id`),
);

-- Address information (private)
CREATE TABLE `Address` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`postalcode` VARCHAR(64) NOT NULL,
	`housenumber` VARCHAR(64) NOT NULL,
	`streetname` INT NOT NULL,
	`city` INT NOT NULL,
	PRIMARY KEY (`id`)
);
 


