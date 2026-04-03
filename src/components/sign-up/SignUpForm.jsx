import React, { useState } from "react";
import { User, Mail, KeyRound, SendHorizontal } from "lucide-react";
import { axiosRequest } from '../../helpers/config.js';
import { validateField, getInputClasses, getContainerClasses } from './signUpForm.utils.js';
import { toast } from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";



const SignUpForm = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const submitSignUpForm = async (e) => {
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

        try {
            const response = await axiosRequest.post("users", form);

            if (response.data.success) {
                toast.success(response.data.message || "Logged in successfully!");
                setLoading(false);
                setForm({ name: "", email: "", password: "", password_confirmation: "" });
                setErrors({});
                setTouched({});
            }
        } catch (error) {
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
                }
            } else {
                toast.error("Unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        const error = validateField(name, value, form);
        setErrors((prev) => ({ ...prev, [name]: error }));

        if (!touched[name]) {
            setTouched((prev) => ({ ...prev, [name]: true }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value, form);
        setErrors((prev) => ({ ...prev, [name]: error }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-16 px-4 relative">
             {/* Subtle background glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-xl bg-white/30 backdrop-blur-3xl border border-white/60 p-12 rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden group">
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/20 transition-all duration-700"></div>
                
                <div className="text-center mb-10">
                    <span className="inline-block text-xs bg-emerald-100 text-emerald-600 font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
                        Join the Community
                    </span>
                    <h1 className="text-5xl font-black text-gray-900 font-dm tracking-tighter mb-4">Create Account</h1>
                    <p className="text-gray-600 font-medium">
                        Already have an account?{" "}
                        <button onClick={() => navigate('/sign-in')} className="text-emerald-600 hover:text-emerald-700 font-bold underline hover:cursor-pointer">
                            Sign in here
                        </button>
                    </p>
                </div>

                <form onSubmit={submitSignUpForm} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                            <div className={getContainerClasses("name", touched, errors)}>
                                <User className="text-slate-400 w-5 h-5 ml-1" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses("name", touched, errors)}
                                    placeholder="John Doe"
                                />
                            </div>
                            {touched.name && errors.name && (
                                <p className="text-red-600 text-xs mt-1.5 ml-2 font-medium">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
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
                                    placeholder="john@example.com"
                                />
                            </div>
                            {touched.email && errors.email && (
                                <p className="text-red-600 text-xs mt-1.5 ml-2 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
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
                                    placeholder="••••••••"
                                />
                            </div>
                            {touched.password && errors.password && (
                                <p className="text-red-600 text-xs mt-1.5 ml-2 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirm</label>
                            <div className={getContainerClasses("password_confirmation", touched, errors)}>
                                <KeyRound className="text-slate-400 w-5 h-5 ml-1" />
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses("password_confirmation", touched, errors)}
                                    placeholder="••••••••"
                                />
                            </div>
                            {touched.password_confirmation && errors.password_confirmation && (
                                <p className="text-red-600 text-xs mt-1.5 ml-2 font-medium">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-3 mt-10 bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer text-white py-5 w-full rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 tracking-tight"
                    >
                        {loading ? "Creating Account..." : "Join Now"}
                        {!loading && <SendHorizontal className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;