# 🩸 Emergency Blood Bank Management System

A comprehensive, life-saving blood donation and management platform built with modern web technologies. This application facilitates real-time blood availability tracking, emergency blood requests, and efficient blood bank management across multiple cities.

![Blood Bank System](https://img.shields.io/badge/Emergency-Blood%20Bank-red?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-green?style=for-the-badge&logo=node.js)

## 🚀 Features

### 🏥 **Emergency Blood Management**
- **Real-time Blood Availability** - Live tracking of blood inventory across blood banks
- **Emergency Search** - Optimized search for critical blood requirements
- **City-specific Data** - Location-based blood bank discovery
- **International Support** - Multi-city support (London, Paris, Berlin, Mumbai, Tokyo)

### 🩸 **Blood Inventory System**
- **Inventory Management** - Complete CRUD operations for blood stock
- **Expiry Tracking** - Monitor blood expiration dates
- **Low Stock Alerts** - Automated notifications for critical stock levels
- **Blood Type Management** - Support for all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)

### 🏥 **Hospital Integration**
- **Hospital Directory** - Comprehensive hospital database
- **Blood Bank Network** - Connected blood bank management
- **Doctor Portal** - Medical professional access system
- **Patient Management** - Patient blood request system

### 🎨 **Modern User Experience**
- **Professional Blue Medical Theme** - Clean, medical-appropriate design
- **Mobile-First Responsive** - Optimized for emergency mobile access
- **Enhanced Tooltips** - Smart positioning system
- **International Calling** - Click-to-call with international support

## 🛠️ Technology Stack

### **Frontend**
- **React.js 19.1** - Modern UI framework
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **React Router** - Navigation system
- **Custom CSS** - Professional medical theme
- **Axios** - HTTP client with interceptors

### **Backend**
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database management
- **PostgreSQL/MySQL** - Database
- **Socket.IO** - Real-time updates
- **JWT Authentication** - Secure authentication

### **Development Tools**
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework

## 📦 Installation

### **Prerequisites**
- Node.js 18.0 or higher
- npm or yarn
- PostgreSQL/MySQL database

### **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your database connection in .env
npx prisma migrate dev
npm run dev
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

## 🌍 Environment Variables

### **Backend (.env)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/blood_bank"
JWT_SECRET="your-jwt-secret-key"
PORT=5000
NODE_ENV=development
```

### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📱 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### **Blood Availability**
- `GET /api/blood-inventory/availability` - Get blood availability
- `GET /api/blood-inventory/emergency/availability` - Emergency blood search
- `GET /api/blood-inventory/city/:cityId/summary` - City blood summary

### **Blood Banks**
- `GET /api/blood-banks` - List blood banks
- `POST /api/blood-banks` - Create blood bank
- `PUT /api/blood-banks/:id` - Update blood bank
- `DELETE /api/blood-banks/:id` - Delete blood bank

### **Hospitals**
- `GET /api/hospitals` - List hospitals
- `POST /api/hospitals` - Create hospital
- `PUT /api/hospitals/:id` - Update hospital

## 🏥 Key Features Implementation

### **Emergency Search Algorithm**
```typescript
// Optimized for life-critical situations
const emergencySearch = await bloodAvailabilityService.getEmergencyBloodAvailability(
  cityId,
  bloodType,
  latitude,
  longitude
);
```

### **Real-time Updates**
```typescript
// Socket.IO integration for live blood inventory updates
io.to(`city-${cityId}`).emit('blood-inventory-update', {
  bloodBankId,
  bloodType,
  quantity,
  availabilityStatus
});
```

### **International Phone Dialing**
```typescript
// Enhanced call functionality with international support
const handleCall = (phoneNumber: string) => {
  window.open(`tel:${phoneNumber}`, '_self');
};
```

## 🎨 Design System

### **Color Palette**
- **Primary Blue**: `#2563eb` - Medical professional theme
- **Emergency Red**: `#dc2626` - Critical alerts
- **Success Green**: `#16a34a` - Available status
- **Warning Orange**: `#ea580c` - Limited stock

### **Typography**
- **Primary Font**: Inter - Modern, readable
- **Secondary Font**: Poppins - Headings and emphasis

## 🚀 Deployment

### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Deploy build folder to hosting service
```

### **Backend (Heroku/DigitalOcean)**
```bash
# Build and deploy backend
npm run build
npm start
```

## 🧪 Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test

# Run integration tests
npm run test:integration
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Emergency Contact

For critical issues or emergency blood requirements:
- **Email**: emergency@bloodbank.org
- **Phone**: +1-800-BLOOD-HELP
- **24/7 Hotline**: Available worldwide

## 🙏 Acknowledgments

- **Medical Professionals** - For guidance on blood banking standards
- **Emergency Services** - For real-world requirements
- **Open Source Community** - For amazing tools and libraries
- **Blood Donors** - Heroes who save lives every day

---

**⚠️ Important**: This system is designed for emergency blood management. Always verify blood compatibility and follow medical protocols before transfusion.

**💝 Remember**: Every donation saves up to 3 lives. Consider becoming a regular blood donor.

---

*Built with ❤️ for saving lives*
