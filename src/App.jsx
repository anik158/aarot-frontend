import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './Home';
import Header from "./components/layouts/Header.jsx";
import Product from "./components/products/Product.jsx";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistStorage,store} from "./redux/store/index.js";
import Cart from "./components/carts/Cart.jsx";
import SignUpForm from "./components/sign-up/SignUpForm.jsx";
import SignInForm from "./components/sign-in/SignInForm.jsx";
import Checkout from "./components/checkout/Checkout.jsx";
import OrderConfirmation from "./pages/Orderconfirmation.jsx";
import React from "react";
import MyOrders from "./pages/MyOrders.jsx";

function App() {

  return (

      <Provider store={store}>
          <PersistGate persistor={persistStorage}>
              <BrowserRouter>
                  <Header/>
                  <Routes>
                      <Route path="/" element={<Home />} />

                      <Route
                          path="/*"
                          element={
                              <main className="container mx-auto px-4 py-2 md:px-6 lg:px-8">
                                  <Routes>
                                      <Route path="/cart" element={<Cart />} />
                                      <Route path="/products/:productId" element={<Product />} />
                                      <Route path="/sign-up" element={<SignUpForm />} />
                                      <Route path="/sign-in" element={<SignInForm />} />
                                      <Route path="/checkout" element={<Checkout />} />
                                      <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                                      <Route path="/my-orders" element={<MyOrders />} />
                                  </Routes>
                              </main>
                          }
                      />
                  </Routes>
              </BrowserRouter>
          </PersistGate>
      </Provider>

  )
}

export default App