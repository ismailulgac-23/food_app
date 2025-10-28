import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white text-black">
      <div className="relative flex flex-col md:flex-row items-center">
        <div className="md:w-1/3 p-8 md:p-12">
          <img
            src="https://www.marktpos.com/hubfs/Blog%20Featured%20Images/Markt%20POS%20Blog/Grocery%20Marketing%20101_%20A%20Beginners%20Guide%20BLOG.webp"
            alt="Promo"
            className="w-full h-[300px] object-cover rounded-xl"
          />
        </div>
        <div className="md:w-2/3 p-8 md:p-12 text-center md:text-left">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🎉 %50 İndirim
            </h2>
            <p className="text-xl text-gray-400 mb-2">
              Tüm Sebzelerde
            </p>
            <p className="text-lg text-gray-400">
              Organik ve taze sebzelerde büyük indirim fırsatı!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/all"
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Hemen Sipariş Ver
            </Link>
            <Link
              to="/all"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors duration-200 text-lg"
            >
              Detayları Gör
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
