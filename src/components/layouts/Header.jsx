import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from 'lucide-react';
import { Link } from "react-router-dom";
import {axiosRequest} from "../../helpers/config.js";
import {toast} from "react-toastify";
import {setLoggedInOut, setToken} from "../../redux/slices/userSlice.js";
import {setCartItems} from "../../redux/slices/cartSlice.js";



const Header = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const token = useSelector((state) => state.user.token);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCartCount = async () => {
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
                    dispatch(setCartItems(items));
                }
            } catch (error) {
                console.error("Failed to load cart on load:", error);
            }
        };
        fetchCartCount();
    }, [dispatch, isLoggedIn, token]);

    const handleLogout = async () => {
        try {
            await axiosRequest.post("/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(setLoggedInOut(false));
            dispatch(setToken(""));
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.log(error)
        }
    };

    return (
        <>
            <header className="App-Header fixed top-0 sm:top-6 inset-x-0 z-50 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <nav className="flex items-center gap-8 bg-white/40 backdrop-blur-3xl border-b sm:border border-white/60 sm:rounded-[2.5rem] p-4 px-6 sm:px-8 lg:px-12 shadow-2xl shadow-gray-200/50 transition-all duration-300 hover:bg-white/50">
                    <div className="relative flex items-center">
                        <Link to={'/'} className="hover:scale-110 transition-transform flex items-center gap-3">
                            <img
                                src="https://www.svgrepo.com/show/499831/target.svg"
                                loading="lazy"
                                style={{ color: "transparent" }}
                                width="40"
                                height="40"
                                alt="Logo"
                            />
                            <span className="text-2xl font-black tracking-tighter text-gray-900 font-dm">aarot</span>
                        </Link>
                    </div>

                    <ul className="hidden items-center justify-center gap-10 md:flex">
                        <li>
                            <Link to="/products" className="font-dm text-sm font-bold text-gray-600 hover:text-emerald-400 transition-all relative group">
                                Products
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </ul>

                    <div className="grow"></div>

                    <div className="hidden items-center justify-center gap-8 md:flex">
                        <Link 
                            className="bg-white/50 backdrop-blur-md border border-white/60 px-5 py-2.5 rounded-full font-dm text-sm font-bold text-gray-800 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:scale-[1.05] hover:cursor-pointer inline-flex items-center gap-3 group" 
                            to={'/cart'}
                        >
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white animate-in zoom-in">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                            <span>Cart</span>
                        </Link>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    to={'/my-account'}
                                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-dm text-sm font-black shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.05] hover:bg-emerald-600 active:scale-[0.98] tracking-tight"
                                >
                                    My Account
                                </Link>
                                <button
                                    className="font-dm text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors hover:cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    className="font-dm text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                                    to="/sign-in"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to={'/sign-up'}
                                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-dm text-sm font-black shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.05] hover:bg-emerald-600 tracking-tight"
                                >
                                    Join for Free
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="relative flex items-center justify-center md:hidden">
                        <button type="button" className="p-2 hover:bg-white/50 rounded-full transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-auto text-slate-900"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;