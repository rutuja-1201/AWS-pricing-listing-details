CREATE DATABASE pricedetails;
show databases;
USE pricedetails;
CREATE TABLE aws_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    pricing DECIMAL(10, 2) ,
    metadata JSON NOT NULL
);
ALTER TABLE aws_services DROP PRIMARY KEY;
ALTER TABLE aws_services MODIFY COLUMN id VARCHAR(255);

select* from aws_services