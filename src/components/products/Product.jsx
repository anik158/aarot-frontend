import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosRequest } from '../../helpers/config';
import { Heart, Share2, Truck, Shield, RotateCcw, Star, ShoppingCart } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductTabs from './ProductTabs';
import {useDispatch} from 'react-redux';
import {addToCart} from "../../redux/slices/cartSlice.js";
import {toast} from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosRequest.get(`products/${productId}`);
        setProduct(response.data.data);
        
        if (response.data.data.colors?.length > 0) {
          setSelectedColor(response.data.data.colors[0].id);
        }
        if (response.data.data.sizes?.length > 0) {
          setSelectedSize(response.data.data.sizes[0].id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }

    const payload = {
      product_id: product.id,
      color_id: selectedColor,
      size_id: selectedSize,
      qty: quantity,
    };

    try {
      setIsAdding(true);

      const response = await axiosRequest.post('/cart/add', payload);

      if (response.data.success) {
        toast.success("Item added to cart successfully!");

        setSelectedColor(null);
        setSelectedSize(null);
        setQuantity(1);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add item to cart";
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.qty || 1)) {
      setQuantity(newQty);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="text-emerald-400 hover:text-emerald-700 font-medium">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            <div className="p-6 lg:p-8 bg-gray-50">
              <ProductImageGallery product={product} />
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-emerald-400">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.qty > 0 ? (
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        In Stock ({product.qty} available)
                      </span>
                    ) : (
                      <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">({product.reviews?.length || 0} reviews)</span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>

              <ColorSelector 
                colors={product.colors} 
                selectedColor={selectedColor} 
                onColorSelect={setSelectedColor} 
              />

              <SizeSelector 
                sizes={product.sizes} 
                selectedSize={selectedSize} 
                onSizeSelect={setSelectedSize} 
              />

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <QuantitySelector 
                  quantity={quantity} 
                  maxQuantity={product.qty} 
                  onQuantityChange={handleQuantityChange} 
                />
                <button
                    onClick={handleAddToCart}
                  disabled={product.status !== 1 || product.qty === 0 || !selectedColor || !selectedSize}
                  className="flex-1 bg-emerald-400 hover:bg-emerald-600 text-white py-3 px-8 rounded-xl font-semibold  hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  {/*<span className="text-sm">Free Shipping</span>*/}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  {/*<span className="text-sm">30 Day Returns</span>*/}
                </div>
              </div>
            </div>
          </div>

          <ProductTabs 
            product={product} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
