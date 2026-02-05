# GreenPulse India

A comprehensive environmental sustainability platform connecting volunteers, delivery personnel, and communities for eco-friendly initiatives across India.

## Features

- **Event Management**: Organize and participate in environmental events like beach cleanups and tree plantation drives
- **Recycling Requests**: Schedule pickup for various recyclable materials (plastic, paper, e-waste, metal, glass)
- **Donation System**: Support environmental causes with secure donation processing and receipt generation
- **User Management**: Role-based access for volunteers, delivery personnel, and administrators
- **Contact System**: Community engagement through contact forms and messaging

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **Bcrypt** password hashing
- **Multer** file uploads
- **PDFKit** receipt generation
- **Nodemailer** email services

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Bootstrap 5** & React Bootstrap for UI
- **Axios** for API calls
- **React Icons** for iconography

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd GreenPulse-India-main
```

2. **Database Setup**
```bash
mysql -u root -p < database/schema.sql
```

3. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your database credentials in .env
npm start
```

4. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint in .env
npm run dev
```

### Environment Variables

**Backend (.env)**
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=greenpulse_db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
GreenPulse-India-main/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── styles/      # CSS styles
│   └── index.html       # Main HTML file
└── database/
    └── schema.sql       # Database schema
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `POST /api/events/:id/register` - Register for event

### Recycling
- `POST /api/recycling/request` - Create recycling request
- `GET /api/recycling/requests` - Get recycling requests

### Donations
- `POST /api/donations` - Process donation
- `GET /api/donations` - Get donation history

## User Roles

- **Volunteers**: Participate in events, make donations, request recycling pickups
- **Delivery Personnel**: Handle recycling pickups and deliveries
- **Administrators**: Manage events, users, and system operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and queries, contact us through the application's contact form or reach out to the development team.