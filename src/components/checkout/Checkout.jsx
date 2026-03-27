import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import {axiosRequest} from "../../helpers/config.js";
import {clearCart} from "../../redux/slices/cartSlice.js";

const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });


    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 3) return 'Name must be at least 3 characters';
                return '';

            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                if (!/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/.test(value))
                    return 'Please enter a valid Bangladeshi phone number';
                return '';


            case 'address':
                if (!value.trim()) return 'Address is required';
                if (value.trim().length < 5) return 'Please enter a complete address';
                return '';

            case 'city':
                if (!value.trim()) return 'City is required';
                return '';

            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));

        if (!touched[name]) {
            setTouched((prev) => ({ ...prev, [name]: true }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        setTouched(Object.keys(formData).reduce((acc, field) => ({ ...acc, [field]: true }), {}));
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        const isValid = validateForm();
        if (!isValid) return;

        const payload = {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            cart_items: cartItems.map(item => ({
                productId: item.productId,
                colorId: item.colorId,
                sizeId: item.sizeId,
                qty: item.qty,
                price: item.price,
            }))
        };

        try {
            const response = await axiosRequest.post('/checkout', payload);

            if (response.data.success) {
                const { order_number } = response.data.data;

                dispatch(clearCart());

                toast.success(`Order placed successfully!\n\nOrder Number: ${order_number}\n\nThank you for shopping with us!`)

                navigate(`/order-confirmation/${order_number}`);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            const errorMessage = error.response?.data?.message ||
                "Something went wrong while placing your order. Please try again.";
            toast.error(errorMessage);
        }finally {
            setIsLoading(false);
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

    if (!isLoggedIn) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <a href="/products" className="text-emerald-500 hover:underline">Continue Shopping</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none ${
                                            touched.name && errors.name ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {touched.name && errors.name && (
                                        <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none ${
                                            touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                        placeholder="01XXXXXXXXX"
                                    />
                                    {touched.phone && errors.phone && (
                                        <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        rows={3}
                                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none ${
                                            touched.address && errors.address ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                        placeholder="House no, street, area..."
                                    />
                                    {touched.address && errors.address && (
                                        <p className="text-red-600 text-xs mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none ${
                                            touched.city && errors.city ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                        placeholder="Enter city"
                                    />
                                    {touched.city && errors.city && (
                                        <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={`${item.productId}-${item.colorId}-${item.sizeId}`} className="flex gap-4 border-b pb-6 last:border-b-0">
                                        <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg border" />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-sm text-gray-500">{item.colorName} • {item.sizeName}</p>
                                            <p className="text-sm mt-1">Qty: {item.qty}</p>
                                        </div>
                                        <div className="font-semibold text-emerald-600">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isLoading}
                                className="w-full mt-8 bg-emerald-500 hover:cursor-pointer hover:bg-emerald-600 disabled:bg-gray-400
               text-white py-4 rounded-2xl font-semibold text-lg transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                        Processing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;