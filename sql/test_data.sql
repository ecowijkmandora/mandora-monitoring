-- MySQL user (use authentication plugin instead of MySQL 8.0's caching_sha2_password)
CREATE USER 'mandora'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mandora';
GRANT ALL PRIVILEGES ON *.* TO 'mandora'@'localhost';

-- Address data
INSERT INTO `address` (`postalcode`,`housenumber`,`streetname`,`city`) VALUES
    ('7315 AA','23','Koninklijk Park','Apeldoorn');

-- Location data
INSERT INTO `location` (`uuid`,`address_id`) VALUES
    (uuid(),1);

-- Authorization data
INSERT INTO `authorization` 
    (`name`,`readonly`,`anonymous`,`protected`,`private`)
VALUES
    ('No access',1,0,0,0),
    ('Anonymous',1,1,0,0),
    ('Anonymous+Protected',1,1,1,0),
    ('Anonymous+Protected+Private',1,1,1,1),
    ('Anonymous+Protected+Private (RW)',0,1,1,1);

-- User data
INSERT INTO `users` (`first_name`,`last_name`,`email`,`username`, `password`,`authorization_id`) VALUES
    ('Mandora','Monitoring', 'monitoring@ecowijkmandora.nl','mandora',AES_ENCRYPT('mandora','MySecretKey'),5);
