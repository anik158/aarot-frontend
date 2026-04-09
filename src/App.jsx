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
import AllProducts from "./pages/AllProducts.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import Footer from "./components/footer/Footer.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import ScrollToTop from "./components/helpers/ScrollToTop.jsx";

function App() {

  return (

      <Provider store={store}>
          <PersistGate persistor={persistStorage}>
              <BrowserRouter>
                  <ScrollToTop />
                  <Header/>
                  <Routes>
                      <Route path="/" element={<Home />} />

                      <Route
                          path="/*"
                          element={
                              <main className="min-h-screen bg-[#f3f7fa] relative overflow-hidden pt-28">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12)_0%,transparent_55%)] pointer-events-none"></div>
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.10)_0%,transparent_55%)] pointer-events-none"></div>

{/* For more bright emerald on top left */}
 {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18)_0%,transparent_50%)] pointer-events-none"></div>
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15)_0%,transparent_50%)] pointer-events-none"></div>
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.4)_0%,transparent_60%)] pointer-events-none"></div>
 */}

                                  <Routes>
                                      <Route path="/cart" element={<Cart />} />
                                      <Route path="/products" element={<AllProducts />} />
                                      <Route path="/products/:productId" element={<Product />} />
                                      <Route path="/sign-up" element={<SignUpForm />} />
                                      <Route path="/sign-in" element={<SignInForm />} />
                                      <Route path="/checkout" element={<Checkout />} />
                                      <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                                      <Route 
                                        path="/my-orders" 
                                        element={
                                            <ProtectedRoute>
                                                <MyOrders />
                                            </ProtectedRoute>
                                        } 
                                      />
                                      <Route 
                                        path="/my-account" 
                                        element={
                                            <ProtectedRoute>
                                                <MyAccount />
                                            </ProtectedRoute>
                                        } 
                                      />
                                  </Routes>
                              </main>
                          }
                      />
                  </Routes>
                  <Footer/>
              </BrowserRouter>
          </PersistGate>
      </Provider>

  )
}

export default App