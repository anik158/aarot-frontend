import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosRequest from '../helpers/config';
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axiosRequest.get(`/my-orders?page=${page}`);

            if (response.data.success) {
                setOrders(response.data.data.data);
                setCurrentPage(response.data.data.current_page);
                setLastPage(response.data.data.last_page);
                setTotal(response.data.data.total);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load your orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1);
    }, []);

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;
        fetchOrders(page);
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders ({total})</h1>
                    <Link to="/products" className="text-emerald-500 hover:underline">
                        Continue Shopping
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center">
                        <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                        <Link
                            to="/products"
                            className="mt-6 inline-block px-8 py-3 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-mono text-xl font-semibold text-gray-900">{order.order_number}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-emerald-600">
                                                ${Number(order.total).toFixed(2)}
                                            </p>
                                            <p className={`text-sm font-medium capitalize mt-1 ${
                                                order.status === 'pending' ? 'text-amber-600' :
                                                    order.status === 'confirmed' ? 'text-emerald-600' : 'text-gray-600'
                                            }`}>
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            to={`/order-confirmation/${order.order_number}`}
                                            className="text-emerald-500 hover:underline font-medium"
                                        >
                                            View Order Details →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {lastPage > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-10">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <span className="font-medium">
                  Page {currentPage} of {lastPage}
                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === lastPage}
                                    className="p-2 disabled:opacity-50"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyOrders;