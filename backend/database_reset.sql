-- Health Connect Database Reset Script
-- WARNING: This will delete ALL existing data!

-- Drop the database if it exists
DROP DATABASE IF EXISTS health_connect;

-- Create a fresh database
CREATE DATABASE health_connect;

-- Use the database
USE health_connect;

-- The tables will be automatically created by Hibernate on application startup
-- based on the JPA entity definitions

-- To run this script:
-- mysql -u your_username -p < database_reset.sql
