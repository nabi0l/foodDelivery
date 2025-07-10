import React, { useState } from 'react';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 12.99,
      category: 'Pizza',
      image: 'https://source.unsplash.com/random/300x200?pizza',
      available: true
    },
    {
      id: 2,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
      price: 8.99,
      category: 'Salad',
      image: 'https://source.unsplash.com/random/300x200?salad',
      available: true
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true
  });

  const handleOpen = (item = null) => {
    if (item) {
      setFormData(item);
      setEditingItem(item.id);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        available: true
      });
      setEditingItem(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem ? { ...formData, id: editingItem } : item
      ));
    } else {
      const newItem = {
        ...formData,
        id: Math.max(...menuItems.map(item => item.id), 0) + 1,
      };
      setMenuItems([...menuItems, newItem]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-red-800">Menu Management</h1>
        <button
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
          onClick={() => handleOpen()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow flex flex-col">
            <img src={item.image} alt={item.name} className="rounded-t-lg h-40 w-full object-cover" />
            <div className="flex-1 flex flex-col p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${item.available ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-500'}`}
                  onClick={() => toggleAvailability(item.id)}
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">{item.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-red-600 font-bold text-lg">${item.price.toFixed(2)}</span>
                <span className="px-2 py-1 border border-red-600 text-red-600 rounded text-xs bg-red-100">{item.category}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-2 border-t">
              <button
                className="p-2 rounded hover:bg-gray-100"
                aria-label="edit"
                onClick={() => handleOpen(item)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
              </button>
              <button
                className="p-2 rounded hover:bg-gray-100"
                aria-label="delete"
                onClick={() => handleDelete(item.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
            <form onSubmit={handleSubmit}>
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <button type="button" className="text-gray-400 hover:text-gray-600" onClick={handleClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full border rounded px-3 py-2"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      className="w-full border rounded px-3 py-2"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      name="category"
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    name="image"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    name="available"
                    type="checkbox"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <label className="text-sm">Available</label>
                </div>
              </div>
              <div className="border-t px-6 py-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
