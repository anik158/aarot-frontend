import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { axiosRequest } from '../helpers/config';
import { setCurrentUser } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Star, ShoppingBag, Save, Clock, Camera, MapPin, Phone, Hash as ZipIcon, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAccount = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [imagePreview, setImagePreview] = useState(user?.profile_image);
  
  // Pagination State
  const [ordersPage, setOrdersPage] = useState({ current: 1, last: 1 });
  const [reviewsPage, setReviewsPage] = useState({ current: 1, last: 1 });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zip_code: user?.zip_code || '',
    password: '',
    password_confirmation: '',
    profile_image: null
  });

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews(1);
    } else if (activeTab === 'orders') {
      fetchOrders(1);
    }
  }, [activeTab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosRequest.get(`/my-reviews?page=${page}`);
      if (res.data.success) {
        setReviews(res.data.data.data);
        setReviewsPage({ current: res.data.data.current_page, last: res.data.data.last_page });
      }
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosRequest.get(`/my-orders?page=${page}`);
      if (res.data.success) {
        setOrders(res.data.data.data);
        setOrdersPage({ current: res.data.data.current_page, last: res.data.data.last_page });
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const PaginationUI = ({ current, last, onPageChange }) => {
    if (last <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-4 mt-10 pb-4">
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className="p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white/40 disabled:hover:text-current shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="bg-white/40 border border-white/60 px-6 py-2 rounded-xl text-sm font-black text-gray-700 shadow-sm">
          Page {current} of {last}
        </div>
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current === last}
          className="p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white/40 disabled:hover:text-current shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      const res = await axiosRequest.post('/profile/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        toast.success("Profile updated!");
        dispatch(setCurrentUser(res.data.data));
        setFormData({ ...formData, password: '', password_confirmation: '', profile_image: null });
      }
    } catch (err) {
        if(err.response?.data?.errors){
            const errors = err.response.data.errors;
            Object.values(errors).forEach(errArray => {
                errArray.forEach(errMsg => toast.error(errMsg));
            });
        } else {
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 sticky top-24 overflow-hidden relative group">
            {/* Subtle glow background */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-emerald-400/20"></div>
            
            <div className="flex flex-col items-center mb-10 relative z-10">
              <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-gray-400/20 transition-all duration-500 group-hover/avatar:scale-105 group-hover/avatar:shadow-emerald-400/20">
                  <img 
                    src={imagePreview || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Camera className="text-white" size={24} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mt-5 font-dm tracking-tight">{user?.name}</h2>
              <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full mt-2 border border-emerald-100/50 shadow-sm">{user?.email}</p>
            </div>
            
            <nav className="space-y-3 relative z-10">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-4 px-6 py-4 hover:cursor-pointer rounded-2xl transition-all duration-300 font-bold group ${activeTab === 'profile' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 -translate-y-0.5' : 'text-gray-500 hover:bg-white/60 hover:text-gray-900'}`}
              >
                <User size={22} className={activeTab === 'profile' ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500 transition-colors'} /> Profile Info
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-4 px-6 py-4 hover:cursor-pointer rounded-2xl transition-all duration-300 font-bold group ${activeTab === 'orders' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 -translate-y-0.5' : 'text-gray-500 hover:bg-white/60 hover:text-gray-900'}`}
              >
                <ShoppingBag size={22} className={activeTab === 'orders' ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500 transition-colors'} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center gap-4 px-6 py-4  hover:cursor-pointer rounded-2xl transition-all duration-300 font-bold group ${activeTab === 'reviews' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 -translate-y-0.5' : 'text-gray-500 hover:bg-white/60 hover:text-gray-900'}`}
              >
                <Star size={22} className={activeTab === 'reviews' ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500 transition-colors'} /> My Reviews
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white/30 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 font-dm tracking-tight">Account Settings</h3>
                <div className="px-5 py-2 bg-white/40 rounded-2xl border border-white/60 text-emerald-600 font-bold text-xs uppercase tracking-widest shadow-sm">Verified Profile</div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  {/* Contact & Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="123 Street Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="text" 
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="New York"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                    <div className="relative group">
                      <ZipIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="text" 
                        value={formData.zip_code}
                        onChange={e => setFormData({...formData, zip_code: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  {/* Password Section */}
                  <hr className="md:col-span-2 border-white/40 my-4" />

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                      <input 
                        type="password" 
                        value={formData.password_confirmation}
                        onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-white/40 border border-white/60 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/40 flex justify-end">
                  <button 
                    disabled={loading}
                    className="flex items-center gap-3 px-10 py-5 hover:cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 tracking-tight"
                  >
                    <Save size={22} /> {loading ? 'Processing...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white/30 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50">
              <h3 className="text-3xl font-black text-gray-900 mb-10 font-dm tracking-tight">My Orders</h3>
              
              {loading ? (
                <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent animate-spin rounded-full"></div></div>
              ) : orders.length > 0 ? (
                <>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white/50 border border-gray-100 rounded-2xl p-6 hover:bg-white transition-all shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                          <ShoppingBag size={24} />
                        </div>
                        <div>
                          <p className="font-mono text-lg font-bold text-gray-900">{order.order_number}</p>
                          <p className="text-xs text-gray-400">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-lg font-black text-emerald-500">${parseFloat(order.total).toFixed(2)}</p>
                          <p className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                            order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                        <Link 
                          to={`/order-confirmation/${order.order_number}`}
                          className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <PaginationUI 
                  current={ordersPage.current} 
                  last={ordersPage.last} 
                  onPageChange={(page) => fetchOrders(page)} 
                />
                </>
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No orders found.</p>
                  <Link to="/products" className="mt-4 inline-block hover:cursor-pointer text-emerald-500 font-bold hover:underline">Start Shopping</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white/30 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50">
              <h3 className="text-3xl font-black text-gray-900 mb-10 font-dm tracking-tight">My Reviews</h3>
              
              {loading ? (
                <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent animate-spin rounded-full"></div></div>
              ) : reviews.length > 0 ? (
                <>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white/50 border border-gray-100 rounded-2xl p-6 flex gap-6 items-start hover:bg-white transition-all shadow-sm">
                      <img src={review.product?.first_image} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/products/${review.product?.id}`} className="font-bold text-gray-900 hover:text-emerald-500 transition-colors">
                            {review.product?.name}
                          </Link>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 mb-1">{review.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{review.body}"</p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          <Clock size={12} /> {review.created_at} 
                          <span className={`px-2 py-0.5 rounded-full ${review.approved == 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                            {review.approved == 1 ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <PaginationUI 
                  current={reviewsPage.current} 
                  last={reviewsPage.last} 
                  onPageChange={(page) => fetchReviews(page)} 
                />
                </>
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">You haven't reviewed any products yet.</p>
                  <Link to="/products" className="mt-4 inline-block text-emerald-500 hover:cursor-pointer font-bold hover:underline">Start Shopping</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
