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

            dispatch(setCurrentUser(user));
            dispatch(setToken(access_token));

            try {
                const guestToken = localStorage.getItem('guest_token');

                if (guestToken) {
                    await axiosRequest.post('/cart/merge', {}, {
                        headers: {
                            'X-Guest-Token': guestToken
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
        <>
            <form onSubmit={submitSignInForm} className="flex flex-col items-center text-sm">

                <h1 className="text-4xl font-bold py-4 text-center">Sign In</h1>
                <p className="max-md:text-sm text-emerald-500 pb-10 text-center">
                    Don't have an account?{" "}
                    <a href="#" className="text-emerald-600 underline">
                        Sign up here
                    </a>
                </p>

                <div className="max-w-96 w-full px-4">

                    <label htmlFor="email" className="font-medium mt-4">Email Address</label>
                    <div className={getContainerClasses("email", touched, errors)}>
                        <Mail className="text-slate-400 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClasses("email", touched, errors)}
                            placeholder="Enter your email address"
                        />
                    </div>
                    {touched.email && errors.email && (
                        <p className="text-red-600 text-xs mt-1 pl-4">{errors.email}</p>
                    )}

                    <label htmlFor="password" className="font-medium mt-4">Password</label>
                    <div className={getContainerClasses("password", touched, errors)}>
                        <KeyRound className="text-slate-400 w-5 h-5" />
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
                        <p className="text-red-600 text-xs mt-1 pl-4">{errors.password}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center hover:cursor-pointer justify-center gap-1 mt-6 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 w-full rounded-full transition disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                        <SendHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </form>

        </>
    )
}

export default SignInForm;