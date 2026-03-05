import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Plus, Minus, BadgeX} from 'lucide-react';
import { increaseQuantity, decreaseQuantity } from "../../redux/slices/cartSlice";

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const calculateTotal = () => {
            let total = 0;
            cartItems.forEach((item) => {
                total += item.price * item.qty;
            });
            setTotalAmount(total);
        };
        
        calculateTotal();
    }, [cartItems]);

    const handleIncreaseQty = (item) => {
        dispatch(increaseQuantity({
            productId: item.productId,
            colorId: item.colorId,
            sizeId: item.sizeId
        }));
    };

    const handleDecreaseQty = (item) => {
        dispatch(decreaseQuantity({
            productId: item.productId,
            colorId: item.colorId,
            sizeId: item.sizeId
        }));
    };

    return (
        <>
            <section className="w-full bg-white dark:white py-9 px-8">
                <h1
                    className="text-center text-[#191919] dark:text-white text-[32px] font-semibold leading-[38px]"
                >
                    My Shopping Cart
                </h1>
                <div className="flex items-start mt-8 gap-6">
                    <div className="bg-white px-4 w-[800px] rounded-xl">
                        <table className="w-full bg-white  rounded-2xl shadow-2xl">
                            <thead>
                            <tr
                                className="text-center border-b border-gray-400 w-full text-[#7f7f7f] text-sm font-medium uppercase mt-2 tracking-wide"
                            >
                                <th className="text-left px-2 py-2">Product</th>
                                <th className="px-2 py-2">price</th>
                                <th className="px-2 py-2">Quantity</th>
                                <th className="px-2 py-2">Subtotal</th>
                                <th className="w-7 px-2 py-2"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems?.map((item) => {
                                const itemSubtotal = item.price * item.qty;
                                return (
                                    <tr className="text-center" key={item.productId}>
                                        <td className="px-2 py-2 text-left align-top">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-[100px] mr-2 inline-block h-[100px]"
                                            /><span>{item.title}</span>
                                        </td>
                                        <td className="px-2 py-2">${item.price.toFixed(2)}</td>
                                        <td
                                            className="p-2 mt-9 bg-white rounded-[170px] border border-[#a0a0a0] justify-around items-center flex"
                                        >
                                            <Minus className="cursor-pointer" onClick={() => handleDecreaseQty(item)} /><span
                                            className="w-10 text-center text-[#191919] text-base font-normal leading-normal"
                                        >
                                                { item.qty}
                                            </span
                                        > <Plus className="cursor-pointer" onClick={() => handleIncreaseQty(item)}/>
                                        </td>
                                        <td className="p-1">${itemSubtotal.toFixed(2)}</td>
                                        <td className="px-2 py-2">
                                            <BadgeX />
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                            <tfoot>
                            <tr className="border-t border-gray-400">
                                <td className="px-2 py-2" colSpan="3">
                                    <button
                                        className="px-8 cursor-pointer py-3.5 bg-[#f2f2f2] rounded-[43px] text-[#4c4c4c] text-sm font-semibold classNameName leading-[16px]"
                                    >
                                        Return to shop
                                    </button>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="w-[424px] bg-white shadow-2xl rounded-lg p-6">
                        <h2 className="text-[#191919] mb-2 text-xl font-medium leading-[30px]">
                            Cart Total
                        </h2>
                        <div className="w-[376px] py-3 justify-between items-center flex">
                            <span className="text-[#4c4c4c] text-base font-normal leading-normal">
                                Total:
                            </span>
                            <span className="text-[#191919] text-base font-semibold leading-tight">
                                ${totalAmount.toFixed(2)}
                            </span>
                        </div>
                        <div
                            className="w-[376px] py-3 shadow-[0px_1px_0px_0px_rgba(229,229,229,1.00)] justify-between items-center flex"
                        >
                            <span className="text-[#4c4c4c] text-sm font-normal leading-[21px]">
                                Shipping:
                            </span>
                            <span className="text-[#191919] text-sm font-medium leading-[21px]">
                                Free
                            </span>
                        </div>
                        <div
                            className="w-[376px] py-3 shadow-[0px_1px_0px_0px_rgba(229,229,229,1.00)] justify-between items-center flex"
                        >
                            <span className="text-[#4c4c4c] text-sm font-normal leading-[21px]">
                                Subtotal:
                            </span>
                            <span className="text-[#191919] text-sm font-medium leading-[21px]">
                                ${totalAmount.toFixed(2)}
                            </span>
                        </div>
                        <button
                            className="w-[376px] text-white mt-5 px-10 py-4 bg-[#00b206] rounded-[44px] gap-4 text-base font-semibold leading-tight"
                        >
                            Proceed to checkout
                        </button>
                    </div>
                </div>
                <div
                    className="mt-6 p-5 w-[800px] bg-white rounded-lg border border-[#e6e6e6] justify-start items-center gap-6 inline-flex"
                >
                    <h3
                        className="text-[#191919] w-1/4 text-xl font-medium classNameName leading-[30px]"
                    >
                        Coupon Code
                    </h3>
                    <div className="w-full border border-[#e6e6e6]">
                        <input
                            placeholder="Enter code"
                            type="text"
                            className="w-2/3 px-6 py-3.5 outline-none bg-white rounded-[46px] text-[#999999] text-base font-normal leading-normal"
                        /><button
                        className="px-10 py-4 bg-[#333333] rounded-[43px] text-white text-base font-semibold leading-tight"
                    >
                        Apply Coupon
                    </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Cart;