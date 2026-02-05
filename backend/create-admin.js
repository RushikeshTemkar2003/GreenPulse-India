const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
    let connection;
    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'greenpulse_db'
        });

        console.log('✅ Connected to database');

        // Hash the password
        const password = 'admin@123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('Generated hash:', hashedPassword);

        // Check if admin exists
        const [existing] = await connection.query(
            'SELECT id FROM users WHERE email = ?',
            ['admin@greenpulse.com']
        );

        if (existing.length > 0) {
            // Update existing admin
            await connection.query(
                'UPDATE users SET password = ?, name = ?, phone = ?, role = ? WHERE email = ?',
                [hashedPassword, 'Admin User', '9876543210', 'admin', 'admin@greenpulse.com']
            );
            console.log('✅ Admin password updated');
        } else {
            // Create new admin
            await connection.query(
                'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
                ['Admin User', 'admin@greenpulse.com', '9876543210', hashedPassword, 'admin']
            );
            console.log('✅ Admin created');
        }

        console.log('');
        console.log('========================================');
        console.log('✅ Admin Account Created Successfully!');
        console.log('========================================');
        console.log('Email:    admin@greenpulse.com');
        console.log('Password: admin@123');
        console.log('========================================');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        if (connection) await connection.end();
        process.exit(1);
    }
}

createAdmin();