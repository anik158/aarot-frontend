export const validateField = (name, value, form) => {
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

export const getInputClasses = (fieldName, touched, errors) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `
      h-full px-2 w-full outline-none bg-transparent
      ${hasError ? "text-red-700" : ""}
    `;
};

export const getContainerClasses = (fieldName, touched, errors) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `
      flex items-center mt-2 mb-1 h-10 pl-3 border rounded-full
      transition-all overflow-hidden
      ${hasError
            ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400"
            : "border-slate-300 focus-within:ring-2 focus-within:ring-emerald-400"}
    `;
};