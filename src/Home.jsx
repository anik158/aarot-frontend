import React, { useEffect, useState } from 'react';
import ProductList from './components/products/ProductList';
import { axiosRequest } from './helpers/config';
import { Truck, Shield, RotateCcw, ShoppingBag } from 'lucide-react';
import heroBg from './assets/hilly-lake.jpg';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mouse follow effect
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

    // Fetch featured products
    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                const response = await axiosRequest.get('/products/featured?limit=3');
                setFeaturedProducts(response.data.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <>
            <section
                id="hero"
                className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-black w-full"
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/95"></div>

                {/* Silver Shining Wind Flow - Much More Visible */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/45 to-transparent animate-wind-shimmer"></div>

                {/* Emerald Mouse Following Light */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle 260px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.30), transparent 65%)`
                    }}
                />

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-6 py-2.5 rounded-full mb-8 border border-emerald-400/30">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium tracking-widest text-emerald-300">PREMIUM COLLECTION { new Date().getFullYear() }</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-none mb-6">
                        Quality That<br />Speaks For Itself
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl mx-auto">
                        Premium products • Honest prices • Fast delivery across Bangladesh
                    </p>

                    <a
                        href="#featured"
                        className="group relative inline-flex items-center justify-center px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30"
                    >
                        <span className="relative z-10">Shop Now</span>
                    </a>
                </div>

                {/* Scroll Indicator - Fixed Position */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70">
                    <span className="text-xs tracking-widest mb-2">SCROLL TO DISCOVER</span>
                    <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/60 to-transparent"></div>
                </div>
            </section>

            {/* Trust Bar */}
            <div className="bg-zinc-950 py-10 border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <Truck className="w-9 h-9 text-emerald-500" />
                        <div className="text-left">
                            <p className="font-semibold text-white">Fast Delivery</p>
                            <p className="text-sm text-gray-400">2-4 days in Bangladesh</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Shield className="w-9 h-9 text-emerald-500" />
                        <div className="text-left">
                            <p className="font-semibold text-white">Secure Payment</p>
                            <p className="text-sm text-gray-400">COD + Card</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <RotateCcw className="w-9 h-9 text-emerald-500" />
                        <div className="text-left">
                            <p className="font-semibold text-white">Easy Returns</p>
                            <p className="text-sm text-gray-400">7 days hassle-free</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <ShoppingBag className="w-9 h-9 text-emerald-500" />
                        <div className="text-left">
                            <p className="font-semibold text-white">100% Original</p>
                            <p className="text-sm text-gray-400">Genuine products only</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products - Moving to the Light Animated Background Style */}
            <div className="relative overflow-hidden bg-[#f8fafc]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12)_0%,transparent_55%)] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.10)_0%,transparent_55%)] pointer-events-none"></div>
                
                <div id="featured" className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-4xl font-bold text-gray-900">Latest Products</h2>
                        <a
                            href="/products"
                            className="text-emerald-400 hover:text-emerald-500 hover:underline font-medium transition-colors"
                        >
                            View All Products →
                        </a>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        <ProductList products={featuredProducts} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;