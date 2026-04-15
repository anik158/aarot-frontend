import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosRequest } from '../../helpers/config';
import { Heart, Share2, Truck, Shield, RotateCcw, Star, ShoppingCart } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductTabs from './ProductTabs';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from "../../redux/slices/cartSlice.js";
import {toast} from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  // Group attributes: { "Storage": [ {id:1, value:"128GB"}, ... ], "Color": [...] }
  const groupedAttributes = product?.attribute_values?.reduce((acc, item) => {
      if (!item.attribute) return acc;
      const attrName = item.attribute.name;
      if (!acc[attrName]) acc[attrName] = [];
      acc[attrName].push(item);
      return acc;
  }, {}) || {};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosRequest.get(`products/${productId}`);
        const fetchedProduct = response.data.data;
        setProduct(fetchedProduct);
        
        // Auto-select first option for each attribute
        const initialSelections = {};
        const attrs = fetchedProduct.attribute_values?.reduce((acc, item) => {
            if (!item.attribute) return acc;
            const attrName = item.attribute.name;
            if (!acc[attrName]) acc[attrName] = [];
            acc[attrName].push(item);
            return acc;
        }, {}) || {};

        Object.keys(attrs).forEach(attrName => {
            if (attrs[attrName].length > 0) {
                initialSelections[attrName] = attrs[attrName][0].value;
            }
        });
        
        setSelectedOptions(initialSelections);

      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteStatus = async () => {
      if (isLoggedIn) {
        try {
          const response = await axiosRequest.get(`/favorites/${productId}/status`);
          setIsFavorite(response.data.is_favorite);
        } catch (error) {
          console.error('Error fetching favorite status:', error);
        }
      }
    };

    fetchProduct();
    fetchFavoriteStatus();
  }, [productId, isLoggedIn]);

  const handleOptionSelect = (attributeName, value) => {
      setSelectedOptions(prev => ({
          ...prev,
          [attributeName]: value
      }));
  };

  const handleAddToCart = async () => {
    // Validate all attributes have a selection
    const missingSelections = Object.keys(groupedAttributes).filter(
        attr => !selectedOptions[attr]
    );

    if (missingSelections.length > 0) {
      toast.error(`Please select ${missingSelections.join(' and ')}`);
      return;
    }

    const payload = {
      product_id: product.id,
      options: selectedOptions,
      qty: quantity,
    };

    try {
      setIsAdding(true);

      const response = await axiosRequest.post('/cart/add', payload);

      if (response.data.success) {
        toast.success("Item added to cart successfully!");
        
        dispatch(addToCart({
            productId: product.id,
            options: selectedOptions,
            qty: quantity,
            price: parseFloat(product.price),
            title: product.name,
            image: product.first_image || product.image,
        }));

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

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to add favorites");
      return;
    }

    try {
      const response = await axiosRequest.post(`/favorites/${product.id}`);
      if (response.data.success) {
        setIsFavorite(response.data.is_favorite);
        toast.success(response.data.is_favorite ? "Added to favorites!" : "Removed from favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
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

  const handleReviewAdded = (newReview) => {
    setProduct((prev) => ({
      ...prev,
      reviews: [newReview, ...(prev.reviews || [])],
    }));
  };

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
                  <button 
                    onClick={handleToggleFavorite}
                    className={`w-10 h-10 rounded-full border border-gray-200 hover:cursor-pointer flex items-center justify-center transition-all duration-300 ${isFavorite ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'}`}
                  >
                    <Heart className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full border border-gray-200 hover:cursor-pointer flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
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

              {Object.keys(groupedAttributes).map((attrName) => (
                  <div key={attrName} className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                          {attrName}: <span className="font-bold">{selectedOptions[attrName]}</span>
                      </h3>
                      <div className="flex flex-wrap gap-3">
                          {groupedAttributes[attrName].map((item) => (
                              <button
                                  key={item.id}
                                  onClick={() => handleOptionSelect(attrName, item.value)}
                                  className={`px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                                      selectedOptions[attrName] === item.value
                                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                          : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-500 hover:text-emerald-600'
                                  }`}
                              >
                                  {item.value}
                              </button>
                          ))}
                      </div>
                  </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <QuantitySelector 
                  quantity={quantity} 
                  maxQuantity={product.qty} 
                  onQuantityChange={handleQuantityChange} 
                />
                <button
                    onClick={handleAddToCart}
                  disabled={
                    product.status !== 1 || 
                    product.qty === 0 || 
                    Object.keys(groupedAttributes).some(attr => !selectedOptions[attr])
                  }
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
            onReviewAdded={handleReviewAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
