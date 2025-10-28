import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: '#eb4031',
        'primary-dark': '#d32f2f',
        'primary-light': '#ff6659',
        
        // Secondary Colors
        secondary: '#4CAF50',
        'secondary-dark': '#388E3C',
        'secondary-light': '#81C784',
        
        // Background Colors
        background: '#FFFFFF',
        'background-light': '#F5F5F5',
        'background-dark': '#2D2D2D',
        
        // Text Colors
        'text-primary': '#2D2D2D',
        'text-secondary': '#757575',
        'text-light': '#BDBDBD',
        'text-white': '#FFFFFF',
        
        // Status Colors
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        
        // Neutral Colors
        'grey-50': '#FAFAFA',
        'grey-100': '#F5F5F5',
        'grey-200': '#EEEEEE',
        'grey-300': '#E0E0E0',
        'grey-400': '#BDBDBD',
        'grey-500': '#9E9E9E',
        'grey-600': '#757575',
        'grey-700': '#616161',
        'grey-800': '#424242',
        'grey-900': '#212121',
        
        // Accent Colors
        accent: '#eb4031',
        'accent-light': '#ffebee',
        
        // Market Theme Colors
        'market-primary': '#eb4031',
        'market-secondary': '#4CAF50',
        'market-accent': '#FF9800',
        'market-background': '#F8F9FA',
        'market-card': '#FFFFFF',
        'market-text': '#2D2D2D',
        'market-text-light': '#757575',
        
        // Food Category Colors
        pizza: '#FF6B35',
        burger: '#8B4513',
        salad: '#4CAF50',
        dessert: '#FF69B4',
        beverage: '#2196F3',
        asian: '#FF9800',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
})
