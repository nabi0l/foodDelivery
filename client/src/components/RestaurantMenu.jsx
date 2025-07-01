import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaMapMarkerAlt, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

// Mock data - replace with API call in a real app
const mockRestaurant = {
  id: 1,
  name: 'Pizza Palace',
  rating: 4.5,
  reviewCount: 124,
  cuisine: 'Italian',
  deliveryFee: '$2.99',
  minOrder: '$10',
  deliveryTime: '30-40 min',
  address: '123 Pasta Street, Foodie City',
  hours: '11:00 AM - 10:00 PM',
  isOpen: true,
  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  menu: {
    categories: [
      {
        id: 'starters',
        name: 'Starters',
        items: [
          {
            id: 1,
            name: 'Garlic Bread',
            description: 'Toasted bread with garlic butter and herbs',
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1585506942814-ec50f7b785af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            isVegetarian: true,
            isSpicy: false,
            customizations: [
              {
                id: 'cheese',
                name: 'Add Cheese',
                price: 1.50,
                isSelected: false
              },
              {
                id: 'garlic',
                name: 'Extra Garlic',
                price: 0.50,
                isSelected: false
              }
            ]
          },
          {
            id: 2,
            name: 'Bruschetta',
            description: 'Toasted bread topped with tomatoes, garlic, and fresh basil',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80',
            isVegetarian: true,
            isSpicy: false
          }
        ]
      },
      {
        id: 'mains',
        name: 'Main Courses',
        items: [
          {
            id: 3,
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
            isVegetarian: true,
            isSpicy: false,
            customizations: [
              {
                id: 'size',
                name: 'Size',
                options: [
                  { id: 'small', name: 'Small', price: 0 },
                  { id: 'medium', name: 'Medium', price: 2.00 },
                  { id: 'large', name: 'Large', price: 4.00, isSelected: true }
                ]
              },
              {
                id: 'toppings',
                name: 'Toppings',
                isMultiSelect: true,
                options: [
                  { id: 'mushrooms', name: 'Mushrooms', price: 1.50, isSelected: false },
                  { id: 'pepperoni', name: 'Pepperoni', price: 2.00, isSelected: false },
                  { id: 'olives', name: 'Olives', price: 1.00, isSelected: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'desserts',
        name: 'Desserts',
        items: [
          {
            id: 4,
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee-soaked ladyfingers',
            price: 6.99,
            image: 'https://images.unsplash.com/photo-1562003389-9023067c2434?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            isVegetarian: true,
            isSpicy: false
          }
        ]
      },
      {
        id: 'drinks',
        name: 'Drinks',
        items: [
          {
            id: 5,
            name: 'Soft Drink',
            description: 'Coke, Sprite, Fanta, or Lemonade',
            price: 2.50,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
            customizations: [
              {
                id: 'drink',
                name: 'Select Drink',
                options: [
                  { id: 'coke', name: 'Coca-Cola', price: 0 },
                  { id: 'sprite', name: 'Sprite', price: 0 },
                  { id: 'fanta', name: 'Fanta', price: 0 },
                  { id: 'lemonade', name: 'Lemonade', price: 0.50 }
                ]
              },
              {
                id: 'size',
                name: 'Size',
                options: [
                  { id: 'regular', name: 'Regular', price: 0 },
                  { id: 'large', name: 'Large', price: 1.00, isSelected: true }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('starters');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [customizations, setCustomizations] = useState({});

  // In a real app, fetch restaurant data by ID
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setRestaurant(mockRestaurant);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        navigate('/restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, navigate]);

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const handleCustomizationChange = (itemId, customizationId, optionId, isMultiSelect = false) => {
    setCustomizations(prev => {
      const itemCustomizations = { ...(prev[itemId] || {}) };
      
      if (!itemCustomizations[customizationId]) {
        itemCustomizations[customizationId] = [];
      }

      if (isMultiSelect) {
        // Toggle the selected state for multi-select options
        const optionIndex = itemCustomizations[customizationId].indexOf(optionId);
        if (optionIndex === -1) {
          itemCustomizations[customizationId].push(optionId);
        } else {
          itemCustomizations[customizationId].splice(optionIndex, 1);
        }
      } else {
        // For single select, replace the current selection
        itemCustomizations[customizationId] = [optionId];
      }

      return {
        ...prev,
        [itemId]: itemCustomizations
      };
    });
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    if (quantity < 1) return;

    const itemCustomizations = customizations[item.id] || {};
    const selectedCustomizations = [];
    
    // Process customizations
    if (item.customizations) {
      item.customizations.forEach(customization => {
        const selectedOptions = itemCustomizations[customization.id] || [];
        
        if (customization.options) {
          // For options with predefined choices
          const options = customization.options.filter(opt => 
            selectedOptions.includes(opt.id)
          );
          
          if (options.length > 0) {
            selectedCustomizations.push({
              name: customization.name,
              options: options.map(opt => ({
                name: opt.name,
                price: opt.price
              }))
            });
          }
        } else if (customization.isSelected) {
          // For simple boolean customizations
          selectedCustomizations.push({
            name: customization.name,
            price: customization.price
          });
        }
      });
    }

    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      customizations: selectedCustomizations,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name
    };

    setCart(prev => [...prev, cartItem]);
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
    setShowCart(true);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, change) => {
    setCart(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const calculateItemTotal = (item) => {
    let total = item.price * item.quantity;
    
    // Add customization prices
    item.customizations?.forEach(customization => {
      if (customization.options) {
        customization.options.forEach(option => {
          total += option.price * item.quantity;
        });
      } else {
        total += customization.price * item.quantity;
      }
    });
    
    return total.toFixed(2);
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + parseFloat(calculateItemTotal(item));
    }, 0).toFixed(2);
  };

  if (loading || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
                <div className="w-full h-48 md:h-56 lg:h-64">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({restaurant.reviewCount})</span>
                    </div>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600">{restaurant.cuisine}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium">{restaurant.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Hours</p>
                      <p className="text-sm font-medium">{restaurant.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium text-green-600">
                      {restaurant.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Menu Categories</h2>
              <nav className="space-y-2">
                {restaurant.menu.categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth' });
                      setActiveCategory(category.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeCategory === category.id
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4 space-y-8">
            {restaurant.menu.categories.map(category => (
              <section key={category.id} id={category.id} className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">{category.name}</h2>
                <div className="space-y-6">
                  {category.items.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-4">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                              <span className="ml-4 font-medium text-gray-900">${item.price.toFixed(2)}</span>
                            </div>
                            {item.description && (
                              <p className="mt-1 text-gray-600 text-sm">{item.description}</p>
                            )}
                            
                            {/* Dietary Info */}
                            <div className="flex items-center mt-2 space-x-3">
                              {item.isVegetarian && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Vegetarian
                                </span>
                              )}
                              {item.isSpicy && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Spicy
                                </span>
                              )}
                            </div>

                            {/* Customizations */}
                            {item.customizations?.map(customization => (
                              <div key={customization.id} className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">{customization.name}:</p>
                                
                                {customization.options ? (
                                  <div className="space-y-2">
                                    {customization.options.map(option => {
                                      const isSelected = customizations[item.id]?.[customization.id]?.includes(option.id);
                                      return (
                                        <label 
                                          key={option.id}
                                          className={`flex items-center space-x-2 text-sm cursor-pointer ${
                                            isSelected ? 'text-red-600' : 'text-gray-700'
                                          }`}
                                        >
                                          <input
                                            type={customization.isMultiSelect ? 'checkbox' : 'radio'}
                                            name={`${item.id}-${customization.id}`}
                                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                            checked={isSelected}
                                            onChange={() => 
                                              handleCustomizationChange(
                                                item.id, 
                                                customization.id, 
                                                option.id,
                                                customization.isMultiSelect
                                              )
                                            }
                                          />
                                          <span>{option.name}</span>
                                          {option.price > 0 && (
                                            <span className="text-gray-500">+${option.price.toFixed(2)}</span>
                                          )}
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`${item.id}-${customization.id}`}
                                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                      checked={customizations[item.id]?.[customization.id]?.length > 0}
                                      onChange={() => 
                                        handleCustomizationChange(
                                          item.id, 
                                          customization.id, 
                                          'selected',
                                          false
                                        )
                                      }
                                    />
                                    <label 
                                      htmlFor={`${item.id}-${customization.id}`}
                                      className="text-sm text-gray-700"
                                    >
                                      {customization.name} 
                                      {customization.price > 0 && (
                                        <span className="text-gray-500"> (+${customization.price.toFixed(2)})</span>
                                      )}
                                    </label>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="ml-4 w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Add to Cart */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button 
                              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              type="button"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 w-10 text-center">
                              {quantities[item.id] || 0}
                            </span>
                            <button 
                              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              type="button"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            disabled={(quantities[item.id] || 0) < 1}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                              (quantities[item.id] || 0) > 0
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <FaShoppingCart className="mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Cart */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ${
        showCart ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Order</h3>
            <button 
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
              <button 
                onClick={() => setShowCart(false)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto mb-4 space-y-4">
                {cart.map(cartItem => (
                  <div key={cartItem.id} className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{cartItem.name}</h4>
                        <span>${(cartItem.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                      
                      {cartItem.customizations?.length > 0 && (
                        <div className="mt-1 text-sm text-gray-500">
                          {cartItem.customizations.map((customization, idx) => (
                            <div key={idx}>
                              <span className="font-medium">{customization.name}: </span>
                              {customization.options ? (
                                <span>{customization.options.map(opt => opt.name).join(', ')}</span>
                              ) : (
                                <span>+${customization.price.toFixed(2)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button 
                            className="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                            onClick={() => updateCartItemQuantity(cartItem.id, -1)}
                            type="button"
                          >
                            <FaMinus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2 w-6 text-center">{cartItem.quantity}</span>
                          <button 
                            className="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                            onClick={() => updateCartItemQuantity(cartItem.id, 1)}
                            type="button"
                          >
                            <FaPlus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(cartItem.id)}
                          className="ml-3 text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">${calculateCartTotal()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Delivery Fee</span>
                  <span className="text-sm">${restaurant.deliveryFee}</span>
                </div>
                {/**cart float the unique one */}
                <div className="flex justify-between items-center text-lg font-bold mb-4">
                  <span>Total</span>
                  <span>${(parseFloat(calculateCartTotal()) + parseFloat(restaurant.deliveryFee.replace(/[^0-9.-]+/g,""))).toFixed(2)}</span>
                </div>
                <button
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart Toggle Button */}
      {cart.length > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          <div className="relative">
            <FaShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

export default RestaurantMenu;
