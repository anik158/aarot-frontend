import {createSlice} from "@reduxjs/toolkit";
import {toast} from "react-toastify";


const initialState = {
    cartItems: [],
    validCoupon: {
        name: '',
        discount: 0,
    },
}

export const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
        addToCart: (state, action) => {
            const item = action.payload;

            const productItem = state.cartItems.find(product =>
                product.productId === item.productId &&
                product.colorId  === item.colorId  &&
                product.sizeId   === item.sizeId
            );

            if (productItem) {
                toast.info('Product already added to cart',{className: "bg-white text-black",
                    progressClassName: "bg-emerald-500" });
            }else{
                state.cartItems = [item, ...state.cartItems];
            }
        },
       removeFromCart: (state, action) => {
            const {productId, colorId, sizeId} = action.payload;
            state.cartItems = state.cartItems.filter((item) => {
                return !(
                    item.productId === productId &&
                    item.colorId === colorId &&
                    item.sizeId === sizeId)
           })

           toast.warn('Product removed from cart');
       },
        increaseQuantity: (state, action) => {
            const { productId, colorId, sizeId } = action.payload;
            const existingItem = state.cartItems.find(
                (item) =>
                    item.productId === productId &&
                    item.colorId === colorId &&
                    item.sizeId === sizeId
            );
            if (existingItem && existingItem.qty < existingItem.maxQty) {
                existingItem.qty++;
            } else if (existingItem && existingItem.qty >= existingItem.maxQty) {
                toast.warn(`Maximum quantity reached for ${existingItem.title}`);
            }
        },
        decreaseQuantity: (state, action) => {
            const { productId, colorId, sizeId } = action.payload;
            const existingItem = state.cartItems.find(
                (item) =>
                    item.productId === productId &&
                    item.colorId === colorId &&
                    item.sizeId === sizeId
            );
            if (existingItem && existingItem.qty > 1) {
                existingItem.qty--;
            } else if (existingItem && existingItem.qty === 1) {
                state.cartItems = state.cartItems.filter(
                    (item) =>
                        !(item.productId === productId && item.colorId === colorId && item.sizeId === sizeId)
                );
                toast.info(`${existingItem.title} removed from cart`);
            }
        },
        clearCart: (state) => {
           state.cartItems = [];
           toast.success("Cart cleared after order placement");
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
   }
})


const cartReducer = cartSlice.reducer

export const {addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, setCartItems} = cartSlice.actions;

export default cartReducer;