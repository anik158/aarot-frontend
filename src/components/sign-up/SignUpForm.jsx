import React, { useState } from "react";
import { User, Mail, KeyRound, SendHorizontal } from "lucide-react";
import { axiosRequest } from '../../helpers/config.js';
import { validateField, getInputClasses, getContainerClasses } from './signUpForm.utils.js';
import { toast } from "react-toastify";


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

        // Run frontend validation first
        const newErrors = {};
        Object.keys(form).forEach((field) => {
            const error = validateField(field, form[field], form); // Pass 'form' for password confirmation
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
                toast.success(response.data.message || "User created successfully!");
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

    return (
        <form onSubmit={submitSignUpForm} className="flex flex-col items-center text-sm">
            <p className="text-xs bg-emerald-200 text-emerald-600 font-medium px-3 py-1 rounded-full">
                Sign Up
            </p>
            <h1 className="text-4xl font-bold py-4 text-center">Create an Account.</h1>
            <p className="max-md:text-sm text-emerald-500 pb-10 text-center">
                Already have an account?{" "}
                <a href="#" className="text-emerald-600 underline">
                    Sign in here
                </a>
            </p>

            <div className="max-w-96 w-full px-4">

                {/* Name */}
                <label htmlFor="name" className="font-medium">Full Name</label>
                <div className={getContainerClasses("name", touched, errors)}>
                    <User className="text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur} // Pass touched and errors to getInputClasses
                        className={getInputClasses("name", touched, errors)}
                        placeholder="Enter your full name"
                    />
                </div>
                {touched.name && errors.name && (
                    <p className="text-red-600 text-xs mt-1 pl-4">{errors.name}</p>
                )}

                {/* Email */}
                <label htmlFor="email" className="font-medium mt-4">Email Address</label>
                <div className={getContainerClasses("email", touched, errors)}>
                    <Mail className="text-slate-400 w-5 h-5" />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur} // Pass touched and errors to getInputClasses
                        className={getInputClasses("email", touched, errors)}
                        placeholder="Enter your email address"
                    />
                </div>
                {touched.email && errors.email && (
                    <p className="text-red-600 text-xs mt-1 pl-4">{errors.email}</p>
                )}

                {/* Password */}
                <label htmlFor="password" className="font-medium mt-4">Password</label>
                <div className={getContainerClasses("password", touched, errors)}>
                    <KeyRound className="text-slate-400 w-5 h-5" />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur} // Pass touched and errors to getInputClasses
                        className={getInputClasses("password", touched, errors)}
                        placeholder="Enter your password"
                    />
                </div>
                {touched.password && errors.password && (
                    <p className="text-red-600 text-xs mt-1 pl-4">{errors.password}</p>
                )}

                {/* Confirm Password */}
                <label htmlFor="password_confirmation" className="font-medium mt-4">
                    Confirm Password
                </label>
                <div className={getContainerClasses("password_confirmation", touched, errors)}>
                    <KeyRound className="text-slate-400 w-5 h-5" />
                    <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        onBlur={handleBlur} // Pass touched and errors to getInputClasses
                        className={getInputClasses("password_confirmation", touched, errors)}
                        placeholder="Confirm your password"
                    />
                </div>
                {touched.password_confirmation && errors.password_confirmation && (
                    <p className="text-red-600 text-xs mt-1 pl-4">
                        {errors.password_confirmation}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center hover:cursor-pointer justify-center gap-1 mt-6 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 w-full rounded-full transition disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Create Account"}
                    <SendHorizontal className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
};

export default SignUpForm;