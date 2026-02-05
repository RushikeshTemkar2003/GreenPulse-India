-- GreenPulse India Database Schema
DROP DATABASE IF EXISTS greenpulse_db;
CREATE DATABASE greenpulse_db;
USE greenpulse_db;

-- Users Table (Volunteers, Delivery Boys, Admin)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('volunteer', 'delivery_boy', 'admin') NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Events Table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_date (date),
    INDEX idx_status (status)
);

-- Event Registrations Table
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    volunteer_id INT NOT NULL,
    event_id INT NOT NULL,
    status ENUM('registered', 'attended', 'completed') DEFAULT 'registered',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (volunteer_id, event_id),
    INDEX idx_volunteer (volunteer_id),
    INDEX idx_event (event_id)
);

-- Donations Table
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    receipt_url VARCHAR(255) DEFAULT NULL,
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_date (donation_date)
);

-- Recycling Requests Table
CREATE TABLE recycling_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    item_type ENUM('plastic', 'paper', 'e-waste', 'metal', 'glass') NOT NULL,
    pickup_date DATE NOT NULL,
    status ENUM('pending', 'assigned', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_to INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_assigned (assigned_to)
);


-- Contact Messages Table
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT DEFAULT NULL,
    details TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
);

-- Insert Default Admin User
INSERT INTO users (name, email, phone, password, role) VALUES
('Admin User', 'admin@greenpulse.com', '9876543210', '$2b$10$rQ8YvP5K9xGZYvF9vN5vQeO9F5dZqJxZqJ5K9xGZYvF9vN5vQeO9F', 'admin');
-- Password: admin123 (hashed with bcrypt)

-- Insert Sample Events
INSERT INTO events (title, description, date, location, status, created_by) VALUES
('Beach Cleanup Drive', 'Join us for a community beach cleanup to protect marine life and keep our shores clean.', '2025-11-15', 'Juhu Beach, Mumbai', 'upcoming', 1),
('Tree Plantation Campaign', 'Plant 1000 trees in urban areas to combat air pollution and increase green cover.', '2025-11-20', 'Aarey Forest, Mumbai', 'upcoming', 1),
('E-Waste Collection', 'Responsible disposal of electronic waste. Bring your old gadgets for proper recycling.', '2025-11-25', 'Various locations', 'upcoming', 1);

-- Insert Sample Recycling Requests
INSERT INTO recycling_requests (request_id, name, email, phone, address, item_type, pickup_date, status) VALUES
('REQ-2025-001', 'Raj Sharma', 'raj@example.com', '9876543211', '123 MG Road, Pune', 'plastic', '2025-11-10', 'pending'),
('REQ-2025-002', 'Priya Patel', 'priya@example.com', '9876543212', '456 FC Road, Pune', 'e-waste', '2025-11-12', 'pending');

-- Create Views for Dashboard Statistics

-- Admin Dashboard Stats View
CREATE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'volunteer') as total_volunteers,
    (SELECT COUNT(*) FROM users WHERE role = 'delivery_boy') as total_delivery_boys,
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM donations) as total_donations,
    (SELECT COALESCE(SUM(amount), 0) FROM donations) as total_donation_amount,
    (SELECT COUNT(*) FROM recycling_requests) as total_recycling_requests,
   

-- Volunteer Statistics View
CREATE VIEW volunteer_stats AS
SELECT 
    u.id as volunteer_id,
    u.name,
    COUNT(DISTINCT er.event_id) as events_participated,
    COUNT(DISTINCT c.id) as certificates_earned,
    COALESCE(SUM(d.amount), 0) as total_donated
FROM users u
LEFT JOIN event_registrations er ON u.id = er.volunteer_id
LEFT JOIN certificates c ON u.id = c.volunteer_id
LEFT JOIN donations d ON u.id = d.user_id
WHERE u.role = 'volunteer'
GROUP BY u.id, u.name;

-- Delivery Boy Statistics View
CREATE VIEW delivery_boy_stats AS
SELECT 
    u.id as delivery_boy_id,
    u.name,
    u.vehicle_type,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'in-progress' THEN t.id END) as active_tasks,
    COUNT(DISTINCT CASE WHEN rr.status = 'completed' THEN rr.id END) as completed_pickups
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to AND t.assigned_role = 'delivery_boy'
LEFT JOIN recycling_requests rr ON u.id = rr.assigned_to
WHERE u.role = 'delivery_boy'
GROUP BY u.id, u.name, u.vehicle_type;

