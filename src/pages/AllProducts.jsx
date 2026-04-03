import React, { useEffect, useState } from 'react';
import ProductList from '../components/products/ProductList';
import { axiosRequest } from '../helpers/config';
import CustomSelect from '../components/common/CustomSelect';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);   // New
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();

                if (selectedCategory) params.append('category', selectedCategory);
                if (selectedSize) params.append('size', selectedSize);
                if (selectedColor) params.append('color', selectedColor);
                if (searchTerm) params.append('search', searchTerm);

                const url = `products${params.toString() ? '?' + params.toString() : ''}`;
                const response = await axiosRequest.get(url);

                console.log('res', response);

                setProducts(response.data.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [selectedCategory, selectedSize, selectedColor, searchTerm]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [catRes, sizeRes, colorRes] = await Promise.all([
                    axiosRequest.get('/categories'),
                    axiosRequest.get('/sizes'),
                    axiosRequest.get('/colors'),
                ]);

                if (catRes.data.success) setCategories(catRes.data.data);
                if (sizeRes.data.success) setSizes(sizeRes.data.data);
                if (colorRes.data.success) setColors(colorRes.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAll();
    }, []);


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

                <CustomSelect
                    label="Sizes"
                    value={selectedSize}
                    options={sizes}
                    onChange={setSelectedSize}
                    placeholder="All Sizes"
                />

                <CustomSelect
                    label="Colors"
                    value={selectedColor}
                    options={colors}
                    onChange={setSelectedColor}
                    placeholder="All Colors"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name..."
                    className="border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-emerald-500 flex-1 min-w-[300px]"
                />

                {(selectedCategory || selectedSize || selectedColor || searchTerm) && (
                    <button
                        onClick={() => {
                            setSelectedCategory('');
                            setSelectedSize('');
                            setSelectedColor('');
                            setSearchTerm('');
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