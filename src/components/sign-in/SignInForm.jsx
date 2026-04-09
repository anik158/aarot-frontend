import React, {useState} from "react"
import {Mail, KeyRound, SendHorizontal} from "lucide-react";
import {getContainerClasses, getInputClasses, validateField} from "../sign-up/signUpForm.utils.js";
import {axiosRequest} from "../../helpers/config.js";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {setCurrentUser, setToken} from "../../redux/slices/userSlice.js";
import {useLocation, useNavigate} from "react-router-dom";


const SignInForm = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const dispatch  = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();

    const submitSignInForm =  async (e) =>{
        e.preventDefault();

        const newErrors = {};
        Object.keys(form).forEach((field) => {
            const error = validateField(field, form[field], form);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);
        setTouched(
            Object.keys(form).reduce((acc, field) => ({ ...acc, [field]: true }), {})
        );

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);

        const handleSuccess = async (response) => {
            const { user, access_token } = response.data.data;

            try {
                const guestToken = localStorage.getItem('guest_token');

                if (guestToken) {
                    // Send merge request using the new user's token directly
                    await axiosRequest.post('/cart/merge', {}, {
                        headers: {
                            'X-Guest-Token': guestToken,
                            'Authorization': `Bearer ${access_token}`
                        }
                    });

                    toast.success("Logged in successfully! Your cart has been merged.");

                    localStorage.removeItem('guest_token');
                } else {
                    toast.success(response.data.message || "Logged in successfully!");
                }
            } catch (mergeError) {
                console.error("Cart merge failed:", mergeError);
                toast.success(response.data.message || "Logged in successfully!");
            }

            // Update Redux state AFTER cart is merged so Header can refetch correctly
            dispatch(setCurrentUser(user));
            dispatch(setToken(access_token));

            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });

            setLoading(false);
            setForm({ email: "", password: "" });
            setErrors({});
            setTouched({});
        };


        try {
            const response  = await axiosRequest.post("login", form)

            if(response.data.success) {
                await handleSuccess(response);
            }

        }catch (error) {
            if (error.response && error.response.data) {
                const { message, errors } = error.response.data;

                toast.error(message);

                if (errors) {
                    setErrors(errors);
                    setTouched(
                        Object.keys(errors).reduce((acc, field) => ({ ...acc, [field]: true }), {})
                    );

                    Object.keys(errors).forEach((field) => {
                        errors[field].forEach((errMsg) => {
                            toast.error(`${field}: ${errMsg}`);
                        });
                    });
                }else {
                    toast.error("Unexpected error occurred. Please try again.");
                }
            }
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm((prev) => ({...prev, [name]: value}));

        const error = validateField(name, value, form);
        setErrors((prev) => ({ ...prev, [name]: error }));

        if (!touched[name]) {
            setTouched((prev) => ({ ...prev, [name]: true }));
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value, form);
        setErrors((prev) => ({ ...prev, [name]: error }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };


    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-lg bg-white/30 backdrop-blur-3xl border border-white/60 p-12 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-400/20 transition-all duration-700"></div>
                
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-gray-900 font-dm tracking-tighter mb-4">Welcome Back</h1>
                    <p className="text-gray-600 font-medium">
                        Don't have an account?{" "}
                        <button onClick={() => navigate('/sign-up')} className="text-emerald-600 hover:text-emerald-700 font-bold underline hover:cursor-pointer">
                            Sign up for free
                        </button>
                    </p>
                </div>

                <form onSubmit={submitSignInForm} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                        <div className={getContainerClasses("email", touched, errors)}>
                            <Mail className="text-slate-400 w-5 h-5 ml-1" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClasses("email", touched, errors)}
                                placeholder="Enter your email"
                            />
                        </div>
                        {touched.email && errors.email && (
                            <p className="text-red-600 text-xs mt-1.5 ml-2 font-medium">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                        <div className={getContainerClasses("password", touched, errors)}>
                            <KeyRound className="text-slate-400 w-5 h-5 ml-1" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClasses("password", touched, errors)}
                                placeholder="Enter your password"
                            />
                        </div>
                        {touched.password && errors.password && (
                            <p className="text-red-600 text-xs mt-1.5 ml-2 font-medium">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-3 mt-10 bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer text-white py-5 w-full rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 tracking-tight"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                        {!loading && <SendHorizontal className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignInForm;