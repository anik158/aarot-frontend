import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Plus, Minus, BadgeX } from 'lucide-react';
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

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const response = await axiosRequest.get('/cart');

            if (response.data.success) {
                let items = response.data.data || [];

                // Normalize data
                items = items.map((item, index) => ({
                    productId: item.productId || item.product_id || `temp-${index}`,
                    colorId: item.colorId || item.color_id || null,
                    sizeId: item.sizeId || item.size_id || null,
                    qty: parseInt(item.qty || item.quantity) || 1,
                    price: parseFloat(item.price) || 0,
                    title: item.title || "Unknown Product",
                    image: item.image || null,
                    colorName: item.colorName || item.color_name || "N/A",
                    sizeName: item.sizeName || item.size_name || "N/A",
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (item, newQty) => {
        if (newQty < 1) return;

        const key = `${item.productId}-${item.colorId || 0}-${item.sizeId || 0}`;
        setUpdatingItems(prev => new Set(prev).add(key));

        try {
            await axiosRequest.post('/cart/update', {
                product_id: item.productId,
                color_id: item.colorId,
                size_id: item.sizeId,
                qty: newQty
            });

            await fetchCart();   // Refresh from backend
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
        const key = `${item.productId}-${item.colorId || 0}-${item.sizeId || 0}`;
        setUpdatingItems(prev => new Set(prev).add(key));

        try {
            await axiosRequest.post('/cart/remove', {
                product_id: item.productId,
                color_id: item.colorId,
                size_id: item.sizeId
            });

            await fetchCart();
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
        <section className="w-full bg-white py-9 px-8">
            <h1 className="text-center text-[#191919] text-[32px] font-semibold">My Shopping Cart</h1>

            <div className="flex items-start mt-8 gap-6">
                <div className="bg-white px-4 w-[800px] rounded-xl">
                    <table className="w-full bg-white rounded-2xl shadow-2xl">
                        <thead>
                        <tr className="text-center border-b border-gray-400 text-[#7f7f7f] text-sm font-medium uppercase">
                            <th className="text-left px-2 py-2">Product</th>
                            <th className="px-2 py-2">Color</th>
                            <th className="px-2 py-2">Size</th>
                            <th className="px-2 py-2">Price</th>
                            <th className="px-2 py-2">Quantity</th>
                            <th className="px-2 py-2">Subtotal</th>
                            <th className="w-7 px-2 py-2"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => {
                            const subtotal = item.price * item.qty;
                            const key = `${item.productId}-${item.colorId || 0}-${item.sizeId || 0}`;
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
                                    <td className="px-2 py-2">{item.colorName}</td>
                                    <td className="px-2 py-2">{item.sizeName}</td>
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

                <div className="w-[424px] bg-white shadow-2xl rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-4">Cart Total</h2>
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
                        className="block w-full text-center mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold"
                    >
                        Proceed to checkout
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Cart;