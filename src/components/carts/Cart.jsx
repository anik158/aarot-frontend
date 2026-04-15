import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {Send, Plus, Minus, BadgeX } from 'lucide-react';
import { toast } from "react-toastify";
import axiosRequest from "../../helpers/config.js";
import { useDispatch } from "react-redux";
import { setCartItems as updateCartItems } from "../../redux/slices/cartSlice.js";

const Cart = () => {
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [updatingItems, setUpdatingItems] = useState(new Set());

    const fetchCart = async (isInitial = false) => {
        try {
            if (isInitial) setIsLoading(true);
            const response = await axiosRequest.get('/cart');

            if (response.data.success) {
                let items = response.data.data || [];

                // Normalize data
                items = items.map((item, index) => ({
                    productId: item.productId || item.product_id || `temp-${index}`,
                    options: item.options || {},
                    qty: parseInt(item.qty || item.quantity) || 1,
                    price: parseFloat(item.price) || 0,
                    title: item.title || "Unknown Product",
                    image: item.image || null,
                }));

                setCartItems(items);
                dispatch(updateCartItems(items));

                const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                setTotalAmount(total);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load cart");
        } finally {
            if (isInitial) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart(true);
    }, []);

    const updateQuantity = async (item, newQty) => {
        if (newQty < 1) return;

        const optionsKey = Object.entries(item.options || {}).sort().map(([k,v]) => `${k}:${v}`).join('|');
        const key = `${item.productId}-${optionsKey}`;
        setUpdatingItems(prev => new Set(prev).add(key));

        try {
            await axiosRequest.post('/cart/update', {
                product_id: item.productId,
                options: item.options,
                qty: newQty
            });

            await fetchCart(false);   // Refresh from backend without unmounting
            toast.success("Quantity updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const removeItem = async (item) => {
        const optionsKey = Object.entries(item.options || {}).sort().map(([k,v]) => `${k}:${v}`).join('|');
        const key = `${item.productId}-${optionsKey}`;
        setUpdatingItems(prev => new Set(prev).add(key));

        try {
            await axiosRequest.post('/cart/remove', {
                product_id: item.productId,
                options: item.options
            });

            await fetchCart(false);
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    if (isLoading) {
        return <div className="text-center py-20">Loading your cart...</div>;
    }

    return (
        <section className="w-full py-20 px-4 min-h-screen relative flex flex-col items-center">
            <h1 className="text-6xl font-black font-dm tracking-tighter text-gray-900 mb-16 relative z-10 text-center">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row items-start gap-12 max-w-7xl mx-auto justify-center relative z-10 w-full">
                <div className="bg-white/30 backdrop-blur-3xl border border-white/60 p-10 rounded-[2.5rem] shadow-2xl w-full lg:w-[850px] shrink-0 relative group">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-400/20 transition-all duration-700"></div>
                    <table className="w-full">
                        <thead>
                        <tr className="text-center border-b border-gray-400 text-[#7f7f7f] text-sm font-medium uppercase">
                            <th className="text-left px-2 py-2">Product</th>
                            <th className="px-2 py-2">Options</th>
                            <th className="px-2 py-2">Price</th>
                            <th className="px-2 py-2">Quantity</th>
                            <th className="px-2 py-2">Subtotal</th>
                            <th className="w-7 px-2 py-2"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => {
                            const subtotal = item.price * item.qty;
                            const optionsKey = Object.entries(item.options || {}).sort().map(([k,v]) => `${k}:${v}`).join('|');
                            const key = `${item.productId}-${optionsKey}`;
                            const isUpdating = updatingItems.has(key);

                            return (
                                <tr key={key} className="text-center">
                                    <td className="px-2 py-2 text-left align-top">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-[100px] h-[100px] inline-block mr-3 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-[100px] h-[100px] bg-gray-100 inline-block mr-3 rounded flex items-center justify-center text-xs text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                        <span className="block mt-1 font-medium">{item.title}</span>
                                    </td>
                                    <td className="px-2 py-2 text-sm text-gray-500">
                                        {Object.entries(item.options || {}).map(([key, val]) => (
                                            <div key={key}><strong>{key}:</strong> {val}</div>
                                        ))}
                                    </td>
                                    <td className="px-2 py-2">${Number(item.price).toFixed(2)}</td>
                                    <td className="p-2">
                                        <div className="flex items-center justify-center gap-3 border rounded-full px-4 py-1">
                                            <Minus
                                                className={`cursor-pointer ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                                                onClick={() => !isUpdating && updateQuantity(item, item.qty - 1)}
                                            />
                                            <span className="w-8 text-center font-medium">{item.qty}</span>
                                            <Plus
                                                className={`cursor-pointer ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                                                onClick={() => !isUpdating && updateQuantity(item, item.qty + 1)}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-1 font-medium">${subtotal.toFixed(2)}</td>
                                    <td className="px-2 py-2">
                                        <BadgeX
                                            className={`cursor-pointer text-red-500 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                                            onClick={() => !isUpdating && removeItem(item)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="w-[424px] bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50">
                    <h2 className="text-2xl font-black mb-8 font-dm tracking-tight text-gray-900">Cart Total</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <Link
                        to="/checkout"
                        className="flex items-center justify-center gap-3 w-full mt-8 py-5 bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer text-white rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] tracking-tight"
                    >
                        <Send className="w-5 h-5" /> Proceed to Checkout
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Cart;