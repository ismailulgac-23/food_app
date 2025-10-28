import React from 'react';
import { Link } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';

interface CategoryGridProps {
  categories: any[];
  loading?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, loading = false }) => {
  // Static categories for fallback
  const staticCategories = [
    {
      name: 'Meyve & Sebze',
      image: 'https://www.eskitadinda.com/img/saglikli_yasam/2/organik-meyve-sebzelerin-farki-nedir_262_2.jpg',
      link: '/category/meyve-sebze'
    },
    {
      name: 'Et & Tavuk',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaIM0S_lqzGTnVT5r7JeasL5ed9f3kvuHMbA&s',
      link: '/category/et-tavuk'
    },
    {
      name: 'Süt & Kahvaltılık',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW88IKrTgOJvk9lHoihBsOmwNX-KltmdGQJA&s',
      link: '/category/sut-kahvaltilik'
    },
    {
      name: 'İçecek',
      image: 'https://sancaktepekanatcican.com/wp-content/uploads/2024/11/77_22-07-28-03-48-35Karbonatli-Icecekler.jpg',
      link: '/category/icecek'
    },
    {
      name: 'Atıştırmalık',
      image: 'https://abp.com.tr/wp-content/uploads/2021/03/atistirmaliklar-1.jpg',
      link: '/category/atistirmalik'
    },
    {
      name: 'Temel Gıda',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9qV-2WC5EvkaVM8Z1w9OjAw0tXgCck2_m3w&s',
      link: '/category/temel-gida'
    },
    {
      name: 'Temizlik',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXWX0PRlGlOBaRPO2OviRBdAqDLmDfeqJlHQ&s',
      link: '/category/temizlik'
    },
    {
      name: 'Tümü',
      image: 'https://imgrosetta.mynet.com.tr/file/20009579/20009579-860x480.jpg',
      link: '/category/tumu'
    }
  ];

  const displayCategories = categories.length > 0 ? categories : staticCategories;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <CircleSpinner size={50} color="#3B82F6" />
          <p className="mt-3 text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
      {displayCategories.map((category, index) => (
        <Link
          key={index}
          to={category.link || `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="aspect-square relative">
            <img
              src={category.image || category.imageUrl || 'https://via.placeholder.com/300x300?text=Kategori'}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-semibold text-sm text-center">
                {category.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
