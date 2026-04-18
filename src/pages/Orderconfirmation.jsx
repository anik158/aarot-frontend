import {useParams, Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosRequest from "../helpers/config.js";
import {CheckCircle} from "lucide-react";


const OrderConfirmation = ()=> {
    const {orderNumber } = useParams();
    const [order, setOrder] = useState(null);
    const [loading  , setLoading ] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchOrder = async ()=>{
            if(!orderNumber) {
                setError("No number provided");
                setLoading(false);
            }

            try{
                setLoading(true);

                const response = await axiosRequest.get(`/orders/${orderNumber}`);

                if(response.data.success) {
                    setOrder(response.data.data);
                }else {
                    setError("Failed to load order details");
                }
            }catch (err) {
                console.error(err);
                setError("Order not found or you don't have permission to view it");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    },[orderNumber]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The order could not be found."}</p>
                    <Link to="/" className="text-emerald-500 hover:underline">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    {/* Success Header */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900">Thank You!</h1>
                        <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
                    </div>

                    {/* Order Number */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 text-center">
                        <p className="text-sm text-emerald-700 font-medium">ORDER NUMBER</p>
                        <p className="text-3xl font-mono font-bold text-emerald-600 tracking-widest mt-1">
                            {order.order_number}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 border-b pb-4 last:border-b-0">
                                    <img
                                        src={item.image || item.product?.first_image}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.title || item.product?.name}</h3>
                                        <p className="text-sm text-gray-500 italic">
                                            {(() => {
                                                let opts = item.options || {};
                                                // Handle potential double-encoding strings from legacy orders
                                                if (typeof opts === 'string') {
                                                    try { opts = JSON.parse(opts); } catch(e) {}
                                                }
                                                return Object.entries(opts).map(([k, v], i, arr) => (
                                                    <span key={k} className="uppercase">{k}: {v}{i < arr.length - 1 ? ' • ' : ''}</span>
                                                ));
                                            })()}
                                        </p>
                                        <p className="text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-medium">
                                        ${Number(item.price).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Paid</span>
                            <span>${Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <Link
                            to="/"
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-semibold text-center transition"
                        >
                            Return to Home
                        </Link>
                        <Link
                            to="/products"
                            className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold text-center hover:bg-gray-50 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
