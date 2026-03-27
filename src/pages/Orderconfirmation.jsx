import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
    const { orderNumber } = useParams();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-2 text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-24 h-24 text-emerald-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8">Thank you for shopping with us.</p>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-2xl font-semibold text-emerald-600 tracking-wider">
                        {orderNumber}
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="block w-full bg-emerald-500 text-white py-4 rounded-2xl font-semibold hover:bg-emerald-600 transition"
                    >
                        Return to Home
                    </Link>

                    <Link
                        to="#"
                        className="block w-full border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;