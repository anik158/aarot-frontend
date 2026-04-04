import React from 'react';
import { Truck, Shield, RotateCcw, ShoppingBag } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-gray-400 py-16 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    <div>
                        <h3 className="text-emerald-400 font-semibold text-lg mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/products" className="hover:text-emerald-300 transition-colors">All Products</a></li>
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">Best Sellers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-emerald-400 font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">Returns Policy</a></li>
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-emerald-400 font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">Our Story</a></li>
                            <li><a href="#" className="hover:text-emerald-300 transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-emerald-400 font-semibold text-lg mb-4">Connect</h3>
                        <p className="text-sm mb-4 text-gray-300">Follow us for latest drops and offers</p>
                        <div className="flex gap-5 text-xl">
                            <a href="#" className="hover:text-emerald-400 transition-colors">FB</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">IG</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">TT</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} aarot. All rights reserved. Crafted in Bangladesh.
                </div>
            </div>
        </footer>
    );
};

export default Footer;