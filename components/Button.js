import React from 'react';

const Button = ({ children, loading = false, ...props }) => {
    return (
        <button
            {...props}
            disabled={loading}
            className={`w-full p-2 bg-[var(--primaryColor)] text-white rounded ${
                loading ? 'opacity-75 cursor-not-allowed' : 'hover:[var(--primaryHoverColor)]'
            } focus:outline-none focus:ring-2 focus:ring-blue-100`}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;