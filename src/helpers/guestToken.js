export const getGuestToken = () => {
    let token = localStorage.getItem('guest_token');

    if (!token) {
        token = 'guest-' + Math.random().toString(36).substring(2) + Date.now();
        localStorage.setItem('guest_token', token);
    }

    return token;
};

export const clearGuestToken = () => {
    localStorage.removeItem('guest_token');
};