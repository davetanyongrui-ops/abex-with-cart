-- Database Schema for ABEX Pumps Shopping Cart
-- Tables for products, orders, and order items

CREATE DATABASE IF NOT EXISTS abex_pumps_db;
USE abex_pumps_db;

-- Table for products
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    image_url VARCHAR(500),
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for orders
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_company VARCHAR(255),
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_postal_code VARCHAR(20) NOT NULL,
    delivery_country VARCHAR(100) NOT NULL,
    order_notes TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    gst DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for order items
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Insert sample products
INSERT INTO products (id, name, description, price, image_url, category) VALUES
('centrifugal-001', 'Centrifugal Pumps', 'High-efficiency pumps for water transfer applications with durable construction.', 899.99, 'images/Water Pump 2.webp', 'Water Pumps'),
('booster-001', 'Booster Pumps', 'Pressure boosting solutions for residential and commercial use with variable speed.', 1299.99, 'images/Water Pump 3.webp', 'Water Pumps'),
('circulator-001', 'Circulator Pumps', 'Efficient circulation pumps for heating and cooling systems with energy saving.', 749.99, 'images/Water Pump 4.webp', 'Water Pumps'),
('deepwell-001', 'Deep Well Pumps', 'High-capacity pumps for deep water extraction with stainless steel construction.', 1599.99, 'images/Water Pump 2.webp', 'Submersible Pumps'),
('sewage-001', 'Sewage Pumps', 'Robust pumps for wastewater and sewage handling with anti-clogging design.', 1199.99, 'images/Water Pump 3.webp', 'Submersible Pumps'),
('industrial-sub-001', 'Industrial Submersible Pumps', 'Heavy-duty submersible pumps for industrial processes with high reliability.', 2199.99, 'images/Water Pump 4.webp', 'Submersible Pumps'),
('chemical-001', 'Chemical Pumps', 'Corrosion-resistant pumps for chemical transfer with specialized materials.', 2499.99, 'images/Water Pump 4.webp', 'Industrial Pumps'),
('slurry-001', 'Slurry Pumps', 'Heavy-duty pumps for abrasive and viscous materials with wear-resistant parts.', 2799.99, 'images/Water Pump 2.webp', 'Industrial Pumps'),
('multistage-001', 'Multistage Pumps', 'High-pressure pumps for demanding applications with multiple impeller stages.', 3299.99, 'images/Water Pump 3.webp', 'Industrial Pumps'),
('controller-001', 'Pump Controllers', 'Advanced control systems for pump automation with variable frequency drives.', 599.99, 'images/Water Pump 1.webp', 'Accessories'),
('tank-001', 'Pressure Tanks', 'Pressure vessels for water storage and pressure maintenance with diaphragm.', 399.99, 'images/Water Pump 5.webp', 'Accessories'),
('valves-001', 'Valves & Fittings', 'Complete range of valves and pipe fittings for pump system installations.', 199.99, 'images/Water Pump 2.webp', 'Accessories');

-- Create database user (optional - adjust as needed)
-- CREATE USER 'abex_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON abex_pumps_db.* TO 'abex_user'@'localhost';