const { promisePool } = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ================= CREATE DONATION =================
exports.createDonation = async (req, res) => {
    try {
        const { name, email, phone, role, amount } = req.body;
        const user_id = req.user ? req.user.id : null;

        if (!name || !email || !phone || !amount) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const transaction_id = `TXN-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`;

        const [result] = await promisePool.query(
            'INSERT INTO donations (user_id, name, email, phone, role, amount, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, name, email, phone, role || 'public', amount, transaction_id]
        );

        const receiptPath = await generateReceipt({
            id: result.insertId,
            name,
            email,
            amount,
            transaction_id,
            date: new Date()
        });

        await promisePool.query(
            'UPDATE donations SET receipt_url = ? WHERE id = ?',
            [receiptPath, result.insertId]
        );

        if (user_id) {
            await promisePool.query(
                'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
                [user_id, 'Donation made', 'donation', result.insertId, `Amount: INR ${amount}/-`]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Donation successful! Thank you for your contribution.',
            donation: {
                id: result.insertId,
                transaction_id,
                receipt_url: receiptPath
            }
        });
    } catch (error) {
        console.error('Create donation error:', error);
        res.status(500).json({
            success: false,
            message: 'Donation failed',
            error: error.message
        });
    }
};

// ================= GENERATE RECEIPT PDF =================
async function generateReceipt(donation) {
    return new Promise((resolve, reject) => {
        const fileName = `receipt-${donation.transaction_id}.pdf`;
        const uploadsDir = path.join(__dirname, '../uploads/receipts');
        const filePath = path.join(uploadsDir, fileName);

        // Ensure uploads folder exists
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // ===== HEADER =====
        doc
            .fontSize(26)
            .fillColor('#2E8B57')
            .font('Helvetica-Bold')
            .text('GreenPulse India', { align: 'center' });

        doc
            .moveDown(0.5)
            .fontSize(18)
            .fillColor('#000000')
            .text('Official Donation Receipt', { align: 'center' })
            .moveDown(1);

        // Divider line
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#2E8B57')
            .stroke()
            .moveDown(1);

        // ===== RECEIPT DETAILS =====
        const date = new Date(donation.date);
        doc.font('Helvetica').fontSize(12).fillColor('#000000');
        doc.text(`Receipt No: ${donation.id}`);
        doc.text(`Transaction ID: ${donation.transaction_id}`);
        doc.text(`Date: ${date.toLocaleDateString()}`);
        doc.text(`Time: ${date.toLocaleTimeString()}`);
        doc.moveDown(1.5);

        // ===== DONOR INFORMATION =====
        doc.font('Helvetica-Bold').fontSize(14).text('Donor Information:', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(12);
        doc.text(`Name: ${donation.name}`);
        doc.text(`Email: ${donation.email}`);
        doc.moveDown(1);

        // ===== AMOUNT SECTION =====
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .fillColor('#000000')
            .text(`Amount Donated: INR ${donation.amount}/-`, { align: 'center' })
            .moveDown(1.5);

        // ===== MESSAGE =====
        doc
            .fontSize(12)
            .font('Helvetica')
            .fillColor('#000000')
            .text(
                'Your contribution helps us promote sustainability and environmental protection. Every donation counts toward a greener tomorrow.',
                { align: 'justify' }
            )
            .moveDown(2);

        // ===== FOOTER =====
        doc
            .font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#2E8B57')
            .text('Authorized Signature:', { align: 'left' })
            .moveDown(2);

        doc
            .font('Helvetica-Oblique')
            .fontSize(11)
            .fillColor('#000000')
            .text('Thank you for your generous support!', { align: 'center' })
            .moveDown(0.5)
            .font('Helvetica')
            .fontSize(10)
            .fillColor('#555555')
            .text('This is a computer-generated receipt and does not require a signature.', { align: 'center' });

        // Finalize PDF
        doc.end();

        stream.on('finish', () => resolve(`/uploads/receipts/${fileName}`));
        stream.on('error', reject);
    });
}

// ================= USER DONATIONS =================
exports.getUserDonations = async (req, res) => {
    try {
        const [donations] = await promisePool.query(
            'SELECT * FROM donations WHERE user_id = ? ORDER BY donation_date DESC',
            [req.user.id]
        );

        res.json({ success: true, count: donations.length, donations });
    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch donations' });
    }
};

// ================= ADMIN: ALL DONATIONS =================
exports.getAllDonations = async (req, res) => {
    try {
        const [donations] = await promisePool.query(
            'SELECT d.*, u.name as user_name FROM donations d LEFT JOIN users u ON d.user_id = u.id ORDER BY d.donation_date DESC'
        );

        const [total] = await promisePool.query('SELECT SUM(amount) as total FROM donations');

        res.json({
            success: true,
            count: donations.length,
            total: total[0].total || 0,
            donations
        });
    } catch (error) {
        console.error('Get all donations error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch donations' });
    }
};
