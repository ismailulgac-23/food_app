import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  isFavorite: boolean;
  viewMode?: 'grid' | 'list';
  onToggleFavorite?: (id: number) => void;
  onAddToCart?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  image,
  badge,
  badgeColor = 'bg-primary',
  inStock,
  isFavorite,
  viewMode = 'grid',
  onToggleFavorite,
  onAddToCart
}) => {
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 hover:border-grey-300 transition-all duration-300 hover:scale-[1.02] group ${
      viewMode === 'list' ? 'flex p-6' : 'p-6'
    }`}>
      <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 mr-6' : 'aspect-square mb-6'}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-xl ${badgeColor}`}>
            {badge}
          </div>
        )}
        <button 
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-xl hover:bg-grey-50 transition-all duration-300 hover:scale-110"
        >
          <svg
            className={`w-4 h-4 transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-current' : 'text-grey-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-xl">Stokta Yok</span>
          </div>
        )}
      </div>

      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h3 className="font-bold text-text-primary mb-3 line-clamp-2 text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-grey-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-text-secondary">
            {rating} ({reviews})
          </span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-text-primary">
              {price}₺
            </span>
            {originalPrice && (
              <span className="text-sm text-text-secondary line-through">
                {originalPrice}₺
              </span>
            )}
          </div>
          {discount && discount > 0 && (
            <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded-xl">
              -%{discount}
            </span>
          )}
        </div>

        <button
          disabled={!inStock}
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
            inStock
              ? 'bg-primary text-white hover:bg-primary-dark transform hover:scale-105'
              : 'bg-grey-200 text-grey-500 cursor-not-allowed'
          }`}
        >
          {inStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;