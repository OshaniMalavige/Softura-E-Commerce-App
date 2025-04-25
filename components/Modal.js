"use client";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaXmark } from 'react-icons/fa6';

const Modal = ({ isOpen, title, fields, values, onChange, onSave, onClose }) => {
    const [selectedColor, setSelectedColor] = useState("#000000");

    const handleColorChange = (color) => {
        setSelectedColor(color.hex);
    };

    const handleAddColor = () => {
        if (!values.colors.includes(selectedColor)) {
            const updatedColors = [...(values.colors || []), selectedColor];
            onChange('colors', updatedColors);
        }
    };

    const handleRemoveColor = (colorToRemove) => {
        const updatedColors = values.colors.filter(color => color !== colorToRemove);
        onChange('colors', updatedColors);
    };

    const handleFileChange = (field, e) => {
        const files = Array.from(e.target.files);
        if (field.multiple) {
            // Handle multiple file uploads
            const updatedFiles = [...(values[field.name] || []), ...files];
            onChange(field.name, updatedFiles);
        } else {
            // Handle single file upload
            const updatedFile = files[0];  // Only take the first file for single upload
            onChange(field.name, updatedFile);
        }
    };

    const handleRemoveImage = (field) => {
        onChange(field.name, null);
    };

    const isTwoColumn = fields.length > 5;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className="bg-white backdrop-blur-lg p-6 rounded-lg w-[95%] max-w-3xl shadow-lg border border-white/20">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-1 text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                        <FaXmark className="h-5 w-5" />
                    </button>
                    <DialogTitle as="h3" className="text-xl font-bold text-[var(--primaryColor)] mb-4">
                        {title}
                    </DialogTitle>
                    <div className={`grid gap-4 ${isTwoColumn ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {fields.map((field) => {
                            if (field.type === "file") {
                                return (
                                    <div key={field.name} className="relative">
                                        <label className="block font-medium text-gray-700">{field.label}</label>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id={field.name}
                                                onChange={(e) => handleFileChange(field, e)}
                                                multiple={field.multiple}
                                            />
                                            <button
                                                onClick={() => document.getElementById(field.name).click()}
                                                className="px-3 py-2 bg-[var(--primaryColor)] text-white rounded-md hover:bg-[var(--primaryHoverColor)]"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                        {/* Display selected image preview for single file or images for multiple files */}
                                        {values[field.name] && (
                                            <div className="mt-2 flex gap-2">
                                                {Array.isArray(values[field.name]) ? (
                                                    // Multiple images
                                                    values[field.name].map((file, idx) => (
                                                        <div key={idx} className="relative">
                                                            <img
                                                                src={file instanceof File ? URL.createObjectURL(file) : `/uploads/${file}`}
                                                                alt={`Preview ${idx + 1}`}
                                                                className="w-32 h-32 object-cover rounded-md"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const updatedFiles = values[field.name].filter((_, index) => index !== idx);
                                                                    onChange(field.name, updatedFiles);
                                                                }}
                                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                            >
                                                                <FaXmark className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    // Single image
                                                    <div className="relative">
                                                        <img
                                                            src={values[field.name] instanceof File ? URL.createObjectURL(values[field.name]) : `/uploads/${values[field.name]}`}
                                                            alt="Preview"
                                                            className="w-32 h-32 object-cover rounded-md"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveImage(field)}
                                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                        >
                                                            <FaXmark className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            if (field.type === "select") {
                                return (
                                    <div key={field.name}>
                                        <label className="block font-medium text-gray-700">{field.label}</label>
                                        <select
                                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                                            value={values[field.name] || ""}
                                            onChange={(e) => onChange(field.name, e.target.value)}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map((opt) => {
                                                const value = typeof opt === "object" ? opt.value : opt;
                                                const label = typeof opt === "object" ? opt.label : opt;
                                                return (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                );
                            }

                            if (field.name === "colors") {
                                return (
                                    <div key={field.name}>
                                        <label className="block font-medium text-gray-700">{field.label}</label>
                                        <ChromePicker color={selectedColor} onChange={handleColorChange} />
                                        <button
                                            onClick={handleAddColor}
                                            className="mt-2 px-3 py-2 bg-[var(--primaryColor)] text-white rounded-md hover:bg-[var(--primaryHoverColor)]"
                                        >
                                            Add Color
                                        </button>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(values.colors || []).map((col, idx) => (
                                                <div key={idx} className="relative flex items-center space-x-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border"
                                                        style={{ backgroundColor: col }}
                                                    ></div>
                                                    <button
                                                        onClick={() => handleRemoveColor(col)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaXmark className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            if (field.type === "checkbox") {
                                return (
                                    <div key={field.name}>
                                        <label className="block font-medium text-gray-700 mb-2">{field.label}</label>
                                        <div className="flex flex-wrap gap-3">
                                            {field.options.map((opt) => {
                                                const value = typeof opt === "object" ? opt.value : opt;
                                                const label = typeof opt === "object" ? opt.label : opt;
                                                const isChecked = values[field.name]?.includes(value);

                                                return (
                                                    <label key={value} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                const updated = e.target.checked
                                                                    ? [...(values[field.name] || []), value]
                                                                    : values[field.name].filter((item) => item !== value);
                                                                onChange(field.name, updated);
                                                            }}
                                                        />
                                                        <span>{label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={field.name}>
                                    <label className="block font-medium text-gray-700">{field.label}</label>
                                    <input
                                        type={field.type || "text"}
                                        placeholder={field.placeholder}
                                        value={values[field.name] || ""}
                                        onChange={(e) => onChange(field.name, e.target.value)}
                                        className="w-full mt-1 p-2 border rounded-md focus:ring-blue-300 border-gray-300"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-[var(--primaryColor)] text-white rounded-md hover:bg-[var(--primaryHoverColor)]"
                            onClick={onSave}
                        >
                            Save
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default Modal;
