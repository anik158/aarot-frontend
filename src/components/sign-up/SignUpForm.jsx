import React, { useState } from "react";
import { User, Mail, KeyRound, SendHorizontal } from "lucide-react";

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

    const validateField = (name, value) => {
        let error = "";

        if (name === "name") {
            if (!value.trim()) {
                error = "Name is required";
            } else if (!/^[A-Za-z\s]+$/.test(value)) {
                error = "Name must contain only letters";
            }
        }

        if (name === "email") {
            if (!value.trim()) {
                error = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = "Invalid email format";
            }
        }

        if (name === "password") {
            if (!value) {
                error = "Password is required";
            } else if (value.length < 8 || value.length > 16) {
                error = "Password must be 8–16 characters";
            }
        }

        if (name === "password_confirmation") {
            if (!value) {
                error = "Please confirm password";
            } else if (value !== form.password) {
                error = "Passwords do not match";
            }
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));

        if (!touched[name]) {
            setTouched((prev) => ({ ...prev, [name]: true }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const submitSignUpForm = (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(form).forEach((field) => {
            const error = validateField(field, form[field]);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);
        setTouched(
            Object.keys(form).reduce((acc, field) => ({ ...acc, [field]: true }), {})
        );

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);

        // Example:
        // await fetch('/api/signup', { method: 'POST', body: JSON.stringify(form) })
        // setLoading(false);
    };

    const getInputClasses = (fieldName) => {
        const hasError = touched[fieldName] && errors[fieldName];
        return `
      h-full px-2 w-full outline-none bg-transparent
      ${hasError ? "text-red-700" : ""}
    `;
    };

    const getContainerClasses = (fieldName) => {
        const hasError = touched[fieldName] && errors[fieldName];
        return `
      flex items-center mt-2 mb-1 h-10 pl-3 border rounded-full 
      transition-all overflow-hidden
      ${hasError
            ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400"
            : "border-slate-300 focus-within:ring-2 focus-within:ring-emerald-400"}
    `;
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
                <div className={getContainerClasses("name")}>
                    <User className="text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses("name")}
                        placeholder="Enter your full name"
                    />
                </div>
                {touched.name && errors.name && (
                    <p className="text-red-600 text-xs mt-1 pl-4">{errors.name}</p>
                )}

                {/* Email */}
                <label htmlFor="email" className="font-medium mt-4">Email Address</label>
                <div className={getContainerClasses("email")}>
                    <Mail className="text-slate-400 w-5 h-5" />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses("email")}
                        placeholder="Enter your email address"
                    />
                </div>
                {touched.email && errors.email && (
                    <p className="text-red-600 text-xs mt-1 pl-4">{errors.email}</p>
                )}

                {/* Password */}
                <label htmlFor="password" className="font-medium mt-4">Password</label>
                <div className={getContainerClasses("password")}>
                    <KeyRound className="text-slate-400 w-5 h-5" />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses("password")}
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
                <div className={getContainerClasses("password_confirmation")}>
                    <KeyRound className="text-slate-400 w-5 h-5" />
                    <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses("password_confirmation")}
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