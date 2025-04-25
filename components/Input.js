import React from 'react';

const Input = React.forwardRef(({ label, type = 'text', error, ...props }, ref) => {
    return (
        <div className="mb-4">
            {label && <label className="block font-medium text-gray-700">{label}</label>}
            <input
                type={type}
                ref={ref}
                {...props}
                className={`w-full p-2 border rounded ${
                    error ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-300`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;