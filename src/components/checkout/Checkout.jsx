import React, { useState, useEffect } from 'react';
import { Send, CreditCard, Banknote } from 'lucide-react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import {axiosRequest} from "../../helpers/config.js";
import {clearCart} from "../../redux/slices/cartSlice.js";

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [fetchingCart, setFetchingCart] = useState(true);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axiosRequest.get('/cart');
                if (response.data.success) {
                    let items = response.data.data || [];
                    
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
                }
            } catch (error) {
                console.error("Failed to load cart for checkout", error);
            } finally {
                setFetchingCart(false);
            }
        };

        if (isLoggedIn) {
            fetchCart();
        } else {
            setFetchingCart(false);
        }
    }, [isLoggedIn]);

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

    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        setIsApplyingCoupon(true);
        try {
            const response = await axiosRequest.post('/coupon/apply', { code: couponCode });
            if (response.data.success) {
                setCouponData(response.data.data);
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Coupon error", error);
            toast.error(error.response?.data?.message || "Invalid coupon code");
            setCouponData(null);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        const isValid = validateForm();
        if (!isValid) return;

        setIsLoading(true);

        const payload = {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            payment_method: paymentMethod,
            coupon_id: couponData ? couponData.id : null,
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

                try {
                    await axiosRequest.delete('/cart/clear');
                } catch (clearError) {
                    console.error("Failed to clear cart:", clearError);
                }

                dispatch(clearCart());

                if (paymentMethod === 'cod') {
                    toast.success(`Order placed successfully! Order Number: ${order_number}`);
                    navigate(`/order-confirmation/${order_number}`);
                } else if (paymentMethod === 'stripe') {
                    const stripeResponse = await axiosRequest.post('/payment/stripe/session', {
                        order_number: order_number
                    });

                    if (stripeResponse.data.success) {
                        window.location.href = stripeResponse.data.data.url;
                    }
                }
            }
        } catch (error) {
            console.error("Checkout error: ", error);
            const errorMessage = error.response?.data?.message ||
                "Something went wrong while placing your order. Please try again.";
            toast.error(errorMessage);
        }finally {
            setIsLoading(false);
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    
    const calculateDiscount = () => {
        if (!couponData) return 0;
        if (couponData.type === 'fixed') return couponData.value;
        return subtotal * (couponData.value / 100);
    };

    const discountAmount = calculateDiscount();
    const finalTotal = subtotal - discountAmount;

    if (!isLoggedIn) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    if (fetchingCart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center bg-white/30 backdrop-blur-3xl p-12 rounded-[2.5rem] border border-white/60 shadow-2xl">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent animate-spin rounded-full mx-auto mb-6"></div>
                    <h2 className="text-2xl font-black text-gray-900 font-dm tracking-tight">Loading checkout...</h2>
                </div>
            </div>
        );
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
        <section className="w-full py-20 px-4 min-h-screen relative flex flex-col items-center">
            <h1 className="text-6xl font-black font-dm tracking-tighter text-gray-900 mb-16 relative z-10">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl w-full">

                    <div className="lg:col-span-7 space-y-8 pb-10">
                        <div className="bg-white/30 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 relative group">
                            <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-400/20 transition-all duration-700"></div>
                            <h2 className="text-2xl font-black mb-10 text-gray-900 font-dm tracking-tight">Shipping Address</h2>

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

                        <div className="bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50">
                            <h2 className="text-2xl font-black mb-10 text-gray-900 font-dm tracking-tight">Order Items</h2>
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

                    <div className="lg:col-span-5 relative z-10 shrink-0">
                        <div className="bg-white/20 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-12 border border-white/60 sticky top-24 overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-400/20 transition-all duration-700"></div>
                            <h2 className="text-3xl font-black mb-10 text-gray-900 font-dm tracking-tighter relative z-10">Order Summary</h2>
                            
                            {/* Coupon Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon code?</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={couponData}
                                        className="flex-1 border border-white/60 bg-white/20 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 uppercase font-bold"
                                    />
                                    {couponData ? (
                                        <button 
                                            onClick={() => {setCouponData(null); setCouponCode('');}}
                                            className="bg-red-500/10 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500/20"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon}
                                            className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                                        >
                                            {isApplyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    )}
                                </div>
                                {couponData && (
                                    <p className="text-emerald-600 text-xs mt-2 font-bold flex items-center gap-1">
                                        ✨ Code {couponData.code} applied!
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between font-medium">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between font-medium">
                                        <span className="text-gray-600">Discount ({couponData.type === 'percentage' ? `${couponData.value}%` : 'Fixed'})</span>
                                        <span className="text-red-500">-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-medium">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-emerald-500">Free</span>
                                </div>
                                <hr className="border-gray-200/50" />
                                <div className="flex justify-between text-xl font-black text-gray-900">
                                    <span>Total</span>
                                    <span>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            {/* Payment Method Selection */}
                            <div className="mt-10">
                                <h2 className="text-xl font-bold mb-6 text-gray-900 font-dm">Payment Method</h2>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Cash on Delivery */}
                                    <label
                                        className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                            paymentMethod === 'cod' ? 'border-emerald-500 bg-white/50 shadow-md' : 'border-white/40 bg-white/20 hover:border-white/60'
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 accent-emerald-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold">Cash on Delivery</p>
                                            <p className="text-sm text-gray-500">Pay when you receive the product</p>
                                        </div>
                                    </label>

                                    {/* Stripe */}
                                    <label
                                        className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                                            paymentMethod === 'stripe' ? 'border-emerald-500 bg-white/50 shadow-md' : 'border-white/40 bg-white/20 hover:border-white/60'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="stripe"
                                            checked={paymentMethod === 'stripe'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 accent-emerald-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold">Credit / Debit Card</p>
                                            <p className="text-sm text-gray-500">Pay securely with Stripe</p>
                                        </div>
                                    </label>
                                </div>
                            </div>


                            <button
                                onClick={handlePlaceOrder}
                                disabled={isLoading}
                                className="w-full mt-8 bg-emerald-400 hover:bg-emerald-600 hover:cursor-pointer  disabled:bg-gray-400
               text-white py-4 rounded-2xl font-semibold text-lg transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                        Processing Order...
                                    </>
                                ) : (
                                      <>
                                <Send className="w-5 h-5" />
                                Place Order
                                </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
        </section>
    );
};

export default Checkout;