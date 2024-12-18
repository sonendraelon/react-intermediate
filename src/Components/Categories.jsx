import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="categories-sidebar p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul>
        {/* Add an "All Stores" option */}
        <li 
          key="all"
          className={`
            cursor-pointer 
            p-2 
            rounded 
            ${selectedCategory === null ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}
          `}
          onClick={() => onCategorySelect(null)}
        >
          All Stores
        </li>

        {categories.map((category) => (
          <li 
            key={category.id}
            className={`
              cursor-pointer 
              p-2 
              rounded 
              ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}
            `}
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
