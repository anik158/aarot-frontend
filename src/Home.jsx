import React, { useEffect, useState } from 'react';
import ProductList from './components/products/ProductList';
import { axiosRequest } from './helpers/config';
import { ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Mouse follow effect for hero
    useEffect(() => {
        const handleMouseMove = (e) => {
            const hero = document.getElementById('hero');
            if (hero) {
                const rect = hero.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                hero.style.setProperty('--mouse-x', `${x}%`);
                hero.style.setProperty('--mouse-y', `${y}%`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();

                if (selectedSize) params.append('size', selectedSize);
                if (selectedColor) params.append('color', selectedColor);
                if (searchTerm) params.append('search', searchTerm);

                const url = `products${params.toString() ? '?' + params.toString() : ''}`;
                const response = await axiosRequest.get(url);

                setProducts(response.data.data || []);
                setColors(response.data.colors || []);
                setSizes(response.data.sizes || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedSize, selectedColor, searchTerm]);

    return (
        <>
            {/* Premium Hero Banner - Refined */}
            <section
                id="hero"
                className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-black w-full"
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{
                        backgroundImage: `url('https://picsum.photos/id/1015/1920/1080')`
                    }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/85"></div>

                {/* Subtle Silver Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer"></div>

                {/* Elegant Mouse Following Light */}
                <div
                    className="absolute inset-0 pointer-events-none transition-all duration-200"
                    style={{
                        background: `radial-gradient(circle 220px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.22), transparent 65%)`
                    }}
                />

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full mb-8 border border-white/20">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium tracking-widest text-white">PREMIUM COLLECTION 2026</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-none mb-6">
                        Quality That<br />Speaks For Itself
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl mx-auto">
                        Premium products • Honest prices • Fast delivery across Bangladesh
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#products"
                            className="group relative inline-flex items-center justify-center px-10 py-4 bg-white text-black font-semibold text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <span className="relative z-10">Shop Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </a>

                        <a
                            href="#why-us"
                            className="inline-flex items-center justify-center px-10 py-4 border border-white/60 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70">
                    <span className="text-xs tracking-widest mb-2">SCROLL TO DISCOVER</span>
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
                </div>
            </section>

            {/* Trust Bar */}
            <div className="bg-white py-8 border-b">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <Truck className="w-9 h-9 text-emerald-600" />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Fast Delivery</p>
                            <p className="text-sm text-gray-500">2-4 days in Bangladesh</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Shield className="w-9 h-9 text-emerald-600" />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Secure Payment</p>
                            <p className="text-sm text-gray-500">COD + Card</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <RotateCcw className="w-9 h-9 text-emerald-600" />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Easy Returns</p>
                            <p className="text-sm text-gray-500">7 days hassle-free</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <ShoppingBag className="w-9 h-9 text-emerald-600" />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">100% Original</p>
                            <p className="text-sm text-gray-500">Genuine products only</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters + Products Section */}
            <div id="products" className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-4xl font-bold text-gray-900">Our Collection</h2>
                    <p className="text-gray-500 text-lg">{products.length} products found</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-3xl shadow-sm mb-12 flex flex-wrap gap-4 items-center">
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">All Sizes</option>
                        {sizes.map(size => (
                            <option key={size.id} value={size.id}>{size.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">All Colors</option>
                        {colors.map(color => (
                            <option key={color.id} value={color.id}>{color.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-emerald-500 flex-1 min-w-[300px]"
                    />

                    {(selectedSize || selectedColor || searchTerm) && (
                        <button
                            onClick={() => { setSelectedSize(''); setSelectedColor(''); setSearchTerm(''); }}
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
        </>
    );
};

export default Home;