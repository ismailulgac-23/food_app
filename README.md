# 🍕 Food Delivery Management System

A complete food delivery management system with admin panel, built with modern technologies.

## 🏗️ Architecture

- **Backend API**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Admin Panel**: React + TypeScript + Tailwind CSS
- **Database**: PostgreSQL with Docker
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- npm

### One-Command Setup

```bash
./start.sh
```

This script will:
1. Install all dependencies
2. Start Docker services (PostgreSQL + Adminer)
3. Set up the database
4. Seed with sample data
5. Start both API and Admin panel

### Manual Setup

#### 1. Start Database Services

```bash
cd food-api
docker-compose up -d
```

#### 2. Setup API

```bash
cd food-api
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

#### 3. Setup Admin Panel

```bash
cd food-admin
npm install
npm run dev
```

## 🌐 Access URLs

- **Admin Panel**: http://localhost:5173
- **API**: http://localhost:3000
- **Adminer (Database UI)**: http://localhost:8080

## 📊 Database Access

**Adminer Credentials:**
- Server: `postgres`
- Username: `food_user`
- Password: `food_password`
- Database: `food_db`

## 🎯 Features

### Admin Panel
- **Dashboard**: Real-time analytics and statistics
- **Category Management**: Full CRUD operations
- **Product Management**: Products with variants
- **Order Management**: Order tracking and status updates
- **Image Upload**: Drag-and-drop image upload
- **Responsive Design**: Mobile-first design

### API Features
- **RESTful API**: Complete CRUD operations
- **Image Upload**: Secure file upload with Multer
- **Database ORM**: Type-safe with Prisma
- **Error Handling**: Comprehensive error management
- **CORS**: Configured for frontend integration

## 📁 Project Structure

```
food/
├── food-api/                 # Backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── generated/       # Prisma generated client
│   │   └── index.ts         # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── docker-compose.yml   # Docker services
│   └── Dockerfile
├── food-admin/              # Admin Panel
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json
└── start.sh                # Quick start script
```

## 🔧 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image/:filename` - Delete image

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get detailed analytics

## 🗄️ Database Schema

### Categories
- id (UUID)
- name (String)
- imageUrl (String, optional)
- products (Relation)

### Products
- id (UUID)
- name (String)
- price (Float)
- imageUrl (String, optional)
- categoryId (UUID, Foreign Key)
- variants (Relation)

### Orders
- id (UUID)
- total (Float)
- status (Enum: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- items (Relation)
- createdAt (DateTime)
- updatedAt (DateTime)

### OrderItems
- id (UUID)
- orderId (UUID, Foreign Key)
- productId (UUID, Foreign Key)
- quantity (Int)
- variants (Relation)

### ProductVariants
- id (UUID)
- name (String)
- price (Float)
- productId (UUID, Foreign Key)

## 🛠️ Development

### API Development

```bash
cd food-api
npm run dev          # Start development server
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

### Admin Panel Development

```bash
cd food-admin
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📝 Sample Data

The system comes with pre-seeded data including:
- 5 categories (Pizza, Burger, Salad, Dessert, Beverage)
- 10 products with variants
- 5 sample orders
- Complete relationships between entities

## 🔒 Security Features

- Input validation
- File upload restrictions
- CORS configuration
- Error handling
- Type safety with TypeScript

## 🎨 UI/UX Features

- Modern, responsive design
- Dark mode support
- Loading states
- Error handling
- Interactive charts and graphs
- Drag-and-drop file upload
- Real-time data updates

## 📱 Responsive Design

The admin panel is fully responsive with:
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interfaces

## 🚀 Deployment

### Production Build

```bash
# API
cd food-api
npm run build
npm start

# Admin Panel
cd food-admin
npm run build
# Serve the dist folder with your preferred server
```

### Docker Production

```bash
cd food-api
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Check the database schema
- Use Adminer for database inspection

---

**Happy Coding! 🎉**
