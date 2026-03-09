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

function App() {

  return (

      <Provider store={store}>
          <PersistGate persistor={persistStorage}>
              <BrowserRouter>
                  <Header/>
                  <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
                      <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/cart" element={<Cart/>}></Route>
                          <Route path="/products/:productId" element={<Product/>} />
                          <Route path="/sign-up" element={<SignUpForm/>} />
                      </Routes>
                  </main>
              </BrowserRouter>
          </PersistGate>
      </Provider>

  )
}

export default App