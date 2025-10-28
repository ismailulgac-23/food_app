# Food API

A comprehensive REST API for food delivery management system built with Node.js, Express, TypeScript, and Prisma.

## Features

- **Category Management**: CRUD operations for product categories
- **Product Management**: CRUD operations for products with variants
- **Order Management**: Complete order lifecycle management
- **Image Upload**: Secure image upload for products and categories
- **Dashboard Analytics**: Comprehensive statistics and analytics
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **File Upload**: Multer
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   cd food-api
   ```

2. **Start the services**:
   ```bash
   docker-compose up -d
   ```

3. **Initialize the database**:
   ```bash
   docker-compose exec api npx prisma db push
   ```

4. **Access the services**:
   - API: http://localhost:3000
   - Adminer (Database UI): http://localhost:8080
   - API Health Check: http://localhost:3000/api/health

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

4. **Set up the database**:
   ```bash
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders (with pagination and filters)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image/:filename` - Delete image
- `GET /api/upload/images` - List all uploaded images

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get detailed analytics

## Database Schema

The API uses the following main entities:

- **Category**: Product categories with optional images
- **Product**: Products with variants, linked to categories
- **Order**: Customer orders with multiple items
- **OrderItem**: Individual items within orders
- **ProductVariant**: Product variations (size, color, etc.)

## Environment Variables

```env
DATABASE_URL="postgresql://food_user:food_password@localhost:5432/food_db?schema=public"
PORT=3000
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Docker Services

- **postgres**: PostgreSQL database
- **adminer**: Database administration tool
- **api**: Food API server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
