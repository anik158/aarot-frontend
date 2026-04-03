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
    }, [dispatch, isLoggedIn]);

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
            <header className="App-Header sticky inset-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
                <nav className="mx-auto flex max-w-6xl gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 py-4">
                    <div className="relative flex items-center">
                        <Link to={'/'}>
                            <img
                                src="https://www.svgrepo.com/show/499831/target.svg"
                                loading="lazy"
                                style={{ color: "transparent" }}
                                width="32"
                                height="32"
                                alt=""
                            />
                        </Link>

                    </div>
                    <ul className="hidden items-center justify-center gap-6 md:flex">
                        <li className="pt-1.5 font-dm text-sm font-medium text-slate-700">
                            <Link to="/products" className="hover:text-emerald-500 transition-colors">Products</Link>
                        </li>
                    </ul>
                    <div className="grow"></div>
                    <div className="hidden items-center justify-center gap-6 md:flex">
                        <Link className="rounded-md bg-linear-to-br from-green-600 to-emerald-400 px-3 py-1.5 font-dm text-sm font-medium text-white shadow-md shadow-green-400/50 transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:cursor-pointer inline-flex items-center gap-2" to={'/cart'}>
                            <ShoppingCart className="w-5 h-5" />
                            Cart{" "} <span className={`px-2 py-0.5 rounded-md ${ cartItems.length > 0 ? "bg-red-600 text-white" : "bg-transparent" }`} > {cartItems.length} </span>
                        </Link>
                        {isLoggedIn ? (
                            <button
                                className="font-dm text-sm hover:cursor-pointer font-medium text-slate-700"
                                onClick={handleLogout}
                            >
                                Sign out
                            </button>
                        ) : (
                            <Link
                                className="font-dm text-sm font-medium text-slate-700"
                                to="/sign-in"
                            >
                                Sign in
                            </Link>
                        )}
                        {
                            (!isLoggedIn && (<Link
                                to={'/sign-up'}
                                className="rounded-md bg-linear-to-br from-green-600 to-emerald-400 px-3 py-1.5 font-dm text-sm font-medium text-white shadow-md shadow-green-400/50 transition-transform duration-200 ease-in-out hover:scale-[1.03]"
                            >
                                Sign up for free
                            </Link>) )
                        }
                        {
                            (isLoggedIn && (<Link
                                to={'/my-account'}
                                className="rounded-md bg-linear-to-br from-green-600 to-emerald-400 px-3 py-1.5 font-dm text-sm font-medium text-white shadow-md shadow-green-400/50 transition-transform duration-200 ease-in-out hover:scale-[1.03]"
                            >
                                My Account
                            </Link>) )
                        }


                    </div>
                    <div className="relative flex items-center justify-center md:hidden">
                        <button type="button">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="h-6 w-auto text-slate-900"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;