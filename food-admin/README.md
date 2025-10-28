# Food Admin Panel

A modern, responsive admin panel for managing food delivery operations built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Comprehensive analytics and statistics
- **Category Management**: Full CRUD operations for product categories
- **Product Management**: Complete product management with variants
- **Order Management**: Order tracking and status management
- **Image Upload**: Drag-and-drop image upload functionality
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: Live data updates from API

## Tech Stack

- **Frontend**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Charts**: ApexCharts

## Quick Start

### Prerequisites

- Node.js 18+
- Food API running (see food-api README)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Access the admin panel**:
   - URL: http://localhost:5173
   - Make sure the Food API is running on http://localhost:3000

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (PageMeta, etc.)
│   └── ecommerce/      # Dashboard-specific components
├── pages/              # Page components
│   ├── Dashboard/      # Dashboard pages
│   ├── Categories/     # Category management
│   ├── Products/       # Product management
│   └── Orders/         # Order management
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Features Overview

### Dashboard
- **Overview Metrics**: Total categories, products, orders, and revenue
- **Order Statistics**: Order status distribution
- **Recent Orders**: Latest order activity
- **Category Analytics**: Product distribution by category
- **Top Products**: Best-selling products
- **Revenue Charts**: Monthly and daily revenue trends

### Category Management
- **List View**: Grid layout with category cards
- **Create/Edit**: Modal-based form with image upload
- **Image Upload**: Drag-and-drop image upload
- **Validation**: Form validation and error handling
- **Delete**: Confirmation-based deletion

### Product Management
- **List View**: Grid layout with product cards
- **Create/Edit**: Comprehensive form with variants
- **Variants**: Dynamic variant management
- **Image Upload**: Product image upload
- **Category Selection**: Dropdown category selection
- **Price Management**: Decimal price input

### Order Management
- **List View**: Table-based order listing
- **Status Filter**: Filter orders by status
- **Status Updates**: Dropdown status updates
- **Order Details**: Detailed order information
- **Item Breakdown**: Product and variant details

## API Integration

The admin panel integrates with the Food API through:

- **Axios HTTP Client**: Configured with base URL and interceptors
- **Type-safe API Calls**: Full TypeScript support
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Loading indicators for better UX

## Environment Configuration

The admin panel expects the Food API to be running on:
- **API Base URL**: http://localhost:3000/api
- **Image Base URL**: http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Responsive Design

The admin panel is fully responsive with:
- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full desktop functionality
- **Breakpoints**: Tailwind CSS responsive breakpoints

## Component Architecture

- **Functional Components**: Modern React with hooks
- **TypeScript**: Full type safety
- **Props Interface**: Well-defined component interfaces
- **State Management**: Local state with useState and useEffect
- **Error Boundaries**: Error handling and fallbacks

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Support for dark mode (if implemented)
- **Consistent Theming**: Unified color scheme and spacing

## Development

### Adding New Features

1. **Create API Service**: Add new API methods in `src/services/api.ts`
2. **Define Types**: Add TypeScript interfaces in `src/types/index.ts`
3. **Create Components**: Build reusable components
4. **Add Pages**: Create new page components
5. **Update Routing**: Add routes to the application

### Code Style

- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (if configured)
- **TypeScript**: Strict type checking
- **Component Structure**: Consistent component organization

## Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

For production deployment, ensure:
- API base URL is correctly configured
- CORS settings allow your domain
- Image upload paths are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License