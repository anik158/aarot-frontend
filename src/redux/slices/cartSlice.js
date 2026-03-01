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
                toast.info('Product already added to cart');
            }else{
                state.cartItems = [item, ...state.cartItems];
                toast.info('Product added to cart');
            }
        }
   }
})


const cartReducer = cartSlice.reducer

export const {addToCart} = cartSlice.actions;

export default cartReducer;