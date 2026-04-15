import React, { useEffect, useState } from 'react';
import ProductList from '../components/products/ProductList';
import { axiosRequest } from '../helpers/config';
import CustomSelect from '../components/common/CustomSelect';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);  
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [attributes, setAttributes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();

                if (selectedCategory) params.append('category', selectedCategory);
                if (searchTerm) params.append('search', searchTerm);
                
                Object.values(selectedOptions).forEach(optionId => {
                    if (optionId) {
                        params.append('options[]', optionId);
                    }
                });

                const url = `products${params.toString() ? '?' + params.toString() : ''}`;
                const response = await axiosRequest.get(url);

                setProducts(response.data.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [selectedCategory, searchTerm, selectedOptions]);

    // Fetch Categories (Once)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosRequest.get('/categories');
                if (response.data.success) setCategories(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Dynamic Attributes
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const url = selectedCategory ? `/attributes?category_id=${selectedCategory}` : '/attributes';
                const response = await axiosRequest.get(url);
                if (response.data.success) {
                    setAttributes(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        // Reset selections when category changes
        setSelectedOptions({});
        fetchAttributes();
    }, [selectedCategory]);

    const handleOptionSelect = (attrId, valueId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [attrId]: valueId
        }));
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-end mb-10">
                <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
                <p className="text-gray-500">{products.length} products</p>
            </div>

            {/* Filters */}
            <div className="relative z-50 bg-white p-6 rounded-3xl shadow-sm mb-12 flex flex-wrap gap-4 items-center">
                <CustomSelect
                    label="Categories"
                    value={selectedCategory}
                    options={categories}
                    onChange={setSelectedCategory}
                    placeholder="All Categories"
                />

                {attributes.map(attr => (
                    <CustomSelect
                        key={attr.id}
                        label={attr.name}
                        value={selectedOptions[attr.id] || ''}
                        options={attr.values}
                        onChange={(val) => handleOptionSelect(attr.id, val)}
                        placeholder={`All ${attr.name}`}
                    />
                ))}

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name..."
                    className="border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-emerald-500 flex-1 min-w-[300px]"
                />

                {(selectedCategory || searchTerm || Object.keys(selectedOptions).length > 0) && (
                    <button
                        onClick={() => {
                            setSelectedCategory('');
                            setSearchTerm('');
                            setSelectedOptions({});
                        }}
                        className="text-red-600 hover:text-red-700 font-medium px-6"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            ) : (
                <ProductList products={products} />
            )}
        </div>
    );
};

export default AllProducts;