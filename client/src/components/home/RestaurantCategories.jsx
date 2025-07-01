import React, { useState } from 'react';
import { 
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const categories = [
  { 
    id: 1, 
    name: 'Pizza', 
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1081&q=80',
    bgColor: 'bg-red-100', 
    textColor: 'text-red-600' 
  },
  { 
    id: 2, 
    name: 'Burgers', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1298&q=80',
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-600' 
  },
  { 
    id: 3, 
    name: 'Desserts', 
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
    bgColor: 'bg-pink-100', 
    textColor: 'text-pink-600' 
  },
  { 
    id: 4, 
    name: 'BBQ', 
    image: 'https://images.unsplash.com/photo-1558030006-450675392173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1134&q=80',
    bgColor: 'bg-orange-100', 
    textColor: 'text-orange-600' 
  },
  { 
    id: 5, 
    name: 'Salads', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    bgColor: 'bg-green-100', 
    textColor: 'text-green-600' 
  },
  { 
    id: 6, 
    name: 'Seafood', 
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-600' 
  },
  { 
    id: 7, 
    name: 'Bakery', 
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1132&q=80',
    bgColor: 'bg-yellow-100', 
    textColor: 'text-yellow-600' 
  },
  { 
    id: 8, 
    name: 'Cafe', 
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80',
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-800' 
  },
  { 
    id: 9, 
    name: 'Drinks', 
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
    bgColor: 'bg-indigo-100', 
    textColor: 'text-indigo-600' 
  },
  { 
    id: 10, 
    name: 'Snacks', 
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-800' 
  },
];

const ITEMS_PER_PAGE = 6;

const RestaurantCategories = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  
  const visibleCategories = categories.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Categories
          </h2>
          <p className="text-gray-500">Browse food by category</p>
        </div>

        <div className="relative">
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 z-10"
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>
          
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 px-2">
              {visibleCategories.map((category) => (
                <div 
                  key={category.id}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div 
                    className={`w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-md ${category.bgColor} flex items-center justify-center mb-3 
                    transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 z-10"
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                currentPage === index ? 'bg-red-600 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantCategories;