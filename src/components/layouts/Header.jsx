import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Menu, X, User, LogIn, UserPlus, Package } from 'lucide-react';
import { Link } from "react-router-dom";
import {axiosRequest} from "../../helpers/config.js";
import {toast} from "react-toastify";
import {setLoggedInOut, setToken} from "../../redux/slices/userSlice.js";
import {setCartItems} from "../../redux/slices/cartSlice.js";



const Header = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const token = useSelector((state) => state.user.token);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const response = await axiosRequest.get('/cart');
                if (response.data.success) {
                    let items = response.data.data || [];
                    items = items.map((item, index) => ({
                        productId: item.productId || item.product_id || `temp-${index}`,
                        options: item.options || {},
                        qty: parseInt(item.qty || item.quantity) || 1,
                        price: parseFloat(item.price) || 0,
                        title: item.title || "Unknown Product",
                        image: item.image || null,
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
        <header className="App-Header fixed top-0 sm:top-6 inset-x-0 z-50 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <nav className="flex items-center justify-between gap-4 bg-white/40 backdrop-blur-3xl border-b sm:border border-white/60 sm:rounded-[2.5rem] p-4 px-6 sm:px-8 lg:px-12 shadow-2xl shadow-gray-200/50 transition-all duration-300 hover:bg-white/50">
                {/* Logo and Desktop Nav */}
                <div className="flex items-center gap-8">
                    <Link to={'/'} className="hover:scale-110 transition-transform flex items-center gap-3">
                        <img
                            src="https://www.svgrepo.com/show/499831/target.svg"
                            loading="lazy"
                            width="40"
                            height="40"
                            alt="Logo"
                        />
                        <span className="text-2xl font-black tracking-tighter text-gray-900 font-dm">aarot</span>
                    </Link>

                    <ul className="hidden md:flex items-center gap-10">
                        <li>
                            <Link to="/products" className="font-dm text-sm font-bold text-gray-600 hover:text-emerald-400 transition-all relative group">
                                Products
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Search / Extras could go here if needed, keeping space open */}

                {/* Right Actions */}
                <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                    {/* Cart Button - Visible everywhere */}
                    <Link 
                        className="bg-white/50 backdrop-blur-md border border-white/60 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-dm text-sm font-bold text-gray-800 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:scale-[1.05] inline-flex items-center gap-2 sm:gap-3 group" 
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
                        <span className="hidden sm:inline">Cart</span>
                    </Link>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-6">
                        {isLoggedIn ? (
                            <>
                                <Link to={'/my-account'} className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-dm text-sm font-black shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.05] hover:bg-emerald-600">
                                    My Account
                                </Link>
                                <button className="font-dm text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors" onClick={handleLogout}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="font-dm text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors" to="/sign-in">
                                    Sign in
                                </Link>
                                <Link to={'/sign-up'} className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-dm text-sm font-black shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.05] hover:bg-emerald-600">
                                    Join for Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        type="button" 
                        className="p-2 hover:bg-white/50 rounded-full transition-colors md:hidden text-gray-900 z-50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="md:hidden mt-2 mx-4 bg-white/95 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300 overflow-hidden relative z-40">
                    <ul className="space-y-4">
                        <li>
                            <Link to="/products" className="flex items-center gap-3 font-dm text-lg font-bold text-gray-800 p-2 rounded-xl hover:bg-emerald-50" onClick={() => setIsMenuOpen(false)}>
                                <Package className="w-5 h-5 text-emerald-500" /> Products
                            </Link>
                        </li>
                        <hr className="border-gray-100" />
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link to="/my-account" className="flex items-center gap-3 font-dm text-lg font-bold text-gray-800 p-2 rounded-xl hover:bg-emerald-50" onClick={() => setIsMenuOpen(false)}>
                                        <User className="w-5 h-5 text-emerald-500" /> My Account
                                    </Link>
                                </li>
                                <li>
                                    <button className="w-full flex items-center gap-3 font-dm text-lg font-bold text-red-500 p-2 rounded-xl hover:bg-red-50" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                                        <X className="w-5 h-5" /> Sign out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/sign-in" className="flex items-center gap-3 font-dm text-lg font-bold text-gray-800 p-2 rounded-xl hover:bg-emerald-50" onClick={() => setIsMenuOpen(false)}>
                                        <LogIn className="w-5 h-5 text-emerald-500" /> Sign in
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sign-up" className="flex items-center justify-center gap-3 bg-emerald-500 text-white p-4 rounded-2xl font-dm text-lg font-black shadow-xl shadow-emerald-500/30" onClick={() => setIsMenuOpen(false)}>
                                        <UserPlus className="w-5 h-5" /> Join for Free
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;