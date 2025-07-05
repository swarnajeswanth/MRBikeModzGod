# 🚀 MrBikeModzGod - Real-Time E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16.1-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-purple?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)

> **A cutting-edge real-time e-commerce platform for bike parts and accessories with advanced store management, real-time synchronization, and comprehensive feature controls.**

## 🌟 Key Features

### 🛍️ **E-Commerce Excellence**

- **Real-time Product Management** - Instant updates across all instances
- **Advanced Store Settings** - Granular control over features and customer experience
- **Multi-Role Authentication** - Customer and retailer accounts with OTP verification
- **Dynamic Feature Toggles** - Enable/disable features in real-time
- **Comprehensive Product Catalog** - Categories, filters, search, and wishlist

### 🔄 **Real-Time Synchronization**

- **WebSocket Integration** - Live updates across multiple browsers and devices
- **Fallback Polling System** - Reliable data sync even when WebSocket fails
- **Cross-Instance Updates** - Changes reflect immediately across all app instances
- **Connection Status Monitoring** - Real-time connection health indicators

### 🎨 **Modern UI/UX**

- **GSAP Animations** - Smooth, professional animations and transitions
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Loading States** - Shimmer effects and skeleton screens
- **Toast Notifications** - User-friendly feedback system
- **Dark Theme** - Modern dark interface with accent colors

### 🛠️ **Advanced Store Management**

- **Feature Controls** - 15+ configurable features (cart, wishlist, reviews, etc.)
- **Page Access Control** - Restrict access to specific pages
- **Customer Experience Settings** - Customize user journey and requirements
- **Real-time Settings Sync** - Instant application of store changes

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB connection
- Gmail account (for OTP authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mrbikemodzgod.git
cd mrbikemodzgod

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Setup

Create a `.env.local` file with:

```env
# ImageKit Configuration
PUBLIC_API_KEY=your_imagekit_public_key
PRIVATE_API_KEY=your_imagekit_private_key
URL_ENDPOINT=your_imagekit_url_endpoint

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Gmail OTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### Running the Application

```bash
# Start everything together (Recommended)
npm run dev:full

# Or start components separately
npm run dev          # Next.js app
npm run websocket    # WebSocket server
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

### Frontend Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **GSAP** - Professional animations
- **Redux Toolkit** - State management with persistence
- **React Hot Toast** - User notifications

### Backend Stack

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Stateless authentication
- **Nodemailer** - Email service for OTP
- **ImageKit** - Image storage and CDN
- **WebSocket** - Real-time communication

### Real-Time Features

- **WebSocket Server** - Custom WebSocket implementation
- **Broadcast System** - Cross-instance message broadcasting
- **Fallback Polling** - Reliable data synchronization
- **Connection Management** - Automatic reconnection and error handling

## 📊 Core Features

### 🔐 Authentication System

- **Multi-Role Support** - Customer and retailer accounts
- **OTP Verification** - Email-based verification for retailers
- **JWT Tokens** - Secure session management
- **Protected Routes** - Role-based access control

### 🛍️ Product Management

- **CRUD Operations** - Complete product lifecycle management
- **Image Upload** - Integrated ImageKit for image storage
- **Category Management** - Dynamic category system
- **Stock Management** - Inventory tracking
- **Pricing System** - Original price, discounts, and promotions

### ⚙️ Store Settings

- **Feature Toggles** - 15+ configurable features
- **Page Access Control** - 8+ page-level restrictions
- **Customer Experience** - 7+ user experience settings
- **Real-time Updates** - Instant application of changes

### 🔄 Real-Time Synchronization

- **WebSocket Integration** - Live data updates
- **Cross-Instance Sync** - Updates across all app instances
- **Fallback System** - Polling when WebSocket unavailable
- **Connection Monitoring** - Real-time status indicators

## 🧪 Testing

```bash
# Test WebSocket connection
npm run test-websocket

# Test real-time synchronization
npm run test-realtime

# Test store settings sync
npm run test-store-settings

# Test toggle functionality
npm run test-toggle
```

## 📁 Project Structure

```
mrbikemodzgod/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── product/           # Product pages
│   ├── components/            # React components
│   │   ├── Authentication/    # Auth components
│   │   ├── Cart/             # Shopping cart
│   │   ├── Dashboard/        # Dashboard components
│   │   ├── Loaders/          # Loading components
│   │   ├── Profile/          # User profile components
│   │   ├── Reviews/          # Review system
│   │   ├── store/            # Redux store
│   │   └── lib/              # Utility functions
│   └── models/               # MongoDB models
├── websocket-server.js       # WebSocket server
├── test-*.js                 # Test scripts
└── *.md                      # Documentation
```

## 🚀 Deployment

### Railway Deployment

The application is configured for Railway deployment with:

- **Frontend Service** - Next.js application
- **WebSocket Service** - Real-time communication server
- **Environment Variables** - Secure configuration management

### Netlify Deployment

Configured with `netlify.toml` for seamless deployment.

## 🔧 Development

### Available Scripts

```bash
npm run dev              # Start Next.js development server
npm run websocket        # Start WebSocket server
npm run dev:full         # Start both servers together
npm run build            # Build for production
npm run start            # Start production server
```

### Testing Commands

```bash
npm run test-websocket     # Test WebSocket connection
npm run test-realtime      # Test real-time sync
npm run test-store-settings # Test store settings sync
npm run test-toggle        # Test toggle functionality
```

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete setup instructions
- [Feature Controls Guide](FEATURE_CONTROLS_GUIDE.md) - Store settings documentation
- [Real-Time Testing Guide](REALTIME_TESTING_GUIDE.md) - Testing real-time features
- [Store Settings Guide](STORE_SETTINGS_SYNC_GUIDE.md) - Store management
- [Seeding System Guide](SEEDING_SYSTEM_GUIDE.md) - Data seeding system
- [WebSocket Troubleshooting](WEBSOCKET_TROUBLESHOOTING.md) - Connection issues
- [Environment Setup](ENVIRONMENT_SETUP.md) - Configuration guide
- [Gmail OTP Setup](GMAIL_OTP_SETUP.md) - Email verification setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **GSAP** - Animation library
- **Redux Toolkit** - State management
- **ImageKit** - Image storage service
- **MongoDB** - Database solution

## 📞 Support

For support and questions:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mrbikemodzgod/issues)
- 📖 Documentation: Check the `/docs` folder

---

**Built with ❤️ using Next.js, React, TypeScript, and modern web technologies.**
