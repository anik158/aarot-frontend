import React from "react";
import {useSelector} from "react-redux";

const Header = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);   // ← .cartItems !

    return (
     <header className="App-Header">
         Header cart{cartItems.length}
     </header>
    )
}

export default Header;