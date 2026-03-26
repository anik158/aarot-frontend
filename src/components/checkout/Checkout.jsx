import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Navigate, useLocation} from "react-router-dom";

const Checkout = ()=> {
    const [cartItems, setCartItems] = useState([]);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const location = useLocation();

    if(!isLoggedIn) {
        return (
            <>
            <Navigate
                to={'/sign-in'}
                state = {{from: location}}
                replace
            />
            </>
        )
    }

    return (
        <>
            <h1>In Checkout Page</h1>
        </>
    )
}

export default Checkout;