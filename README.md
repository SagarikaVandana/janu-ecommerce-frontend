# Janu Collection E-commerce Frontend

A modern, responsive React-based frontend for the Janu Collection e-commerce platform with comprehensive features for product browsing, shopping cart management, user authentication, and payment processing.

## 🚀 Features

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Smooth animations with Framer Motion
  - Beautiful product cards and layouts
  - Mobile-first approach

- **User Authentication**
  - Login/Register functionality
  - JWT token management
  - Protected routes
  - User profile management

- **Product Management**
  - Product browsing and search
  - Product details with images
  - Category filtering
  - Wishlist functionality

- **Shopping Experience**
  - Shopping cart with real-time updates
  - Add/remove items
  - Quantity management
  - Cart persistence

- **Payment Integration**
  - Multiple payment methods (Stripe, UPI, Bank Transfer)
  - QR code generation for UPI payments
  - Transaction number verification
  - Payment status tracking

- **Admin Dashboard**
  - Product management
  - Order management
  - User management
  - Analytics and reports
  - Newsletter management

- **Social Integration**
  - WhatsApp contact integration
  - Instagram, Facebook, YouTube links
  - Newsletter subscription
  - Contact forms

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SagarikaVandana/janu-ecommerce-frontend.git
   cd janu-ecommerce-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://janu-ecommerce-backend.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── WhatsAppContact.tsx
│   │   └── Logo.tsx
│   ├── context/         # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Payment.tsx
│   │   ├── Profile.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── admin/       # Admin pages
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 🎨 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **QRCode React** - QR code generation

## 🔌 API Integration

The frontend integrates with the backend API at `https://janu-ecommerce-backend.onrender.com/api`:

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Users**: `/api/users/*`
- **Payment Settings**: `/api/payment-settings/*`
- **Newsletter**: `/api/newsletter/*`

## 🎯 Key Features

### User Features
- **Product Browsing**: Browse products with search and filtering
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Secure login/register with JWT
- **Profile Management**: Update personal information
- **Order Tracking**: View order history and status
- **Wishlist**: Save favorite products

### Admin Features
- **Dashboard**: Overview of sales, orders, and users
- **Product Management**: Add, edit, and delete products
- **Order Management**: Process and update order status
- **Payment Settings**: Configure payment methods
- **Newsletter Management**: Manage email subscriptions
- **Analytics**: View business metrics and reports

### Payment Features
- **Multiple Payment Methods**: Stripe, UPI, Bank Transfer
- **QR Code Generation**: Dynamic UPI QR codes
- **Transaction Verification**: Secure payment confirmation
- **Payment Status Tracking**: Real-time payment updates

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the static files

## 🔧 Environment Variables

```env
# API Configuration
VITE_API_URL=https://janu-ecommerce-backend.onrender.com/api

# Payment Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key

# Social Media Links
VITE_WHATSAPP_NUMBER=+919391235258
VITE_INSTAGRAM_URL=https://www.instagram.com/janucollectionvizag/
VITE_FACEBOOK_URL=https://www.facebook.com/janucollectionvizag
VITE_YOUTUBE_URL=https://www.youtube.com/@Janucollectionvizag
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support, email: janucollectionvizag@gmail.com

## 🔗 Links

- **Backend Repository**: [Janu Collection Backend](https://github.com/SagarikaVandana/janu-ecommerce-backend.)
- **Backend API**: [https://janu-ecommerce-backend.onrender.com](https://janu-ecommerce-backend.onrender.com)
- **Live Demo**: [Janu Collection](https://janu-collection.vercel.app)
- **API Documentation**: [https://janu-ecommerce-backend.onrender.com/docs](https://janu-ecommerce-backend.onrender.com/docs)

---

**Built with ❤️ for Janu Collection** 