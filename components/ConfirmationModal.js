import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaXmark } from "react-icons/fa6";

const ConfirmationModal = ({ isOpen, onClose, onDelete, itemName }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className="bg-white p-6 rounded-lg w-80 shadow-lg border border-white/20 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-1 text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                        <FaXmark className="h-5 w-5" />
                    </button>
                    <DialogTitle as="h3" className="text-2xl font-bold text-black mb-4">
                        Confirm Deletion
                    </DialogTitle>
                    <p className="text-gray-800">Are you sure you want to delete this category <b>{itemName}</b>?</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-[var(--primaryColor)] text-white rounded-md hover:bg-[var(--primaryHoverColor)]" onClick={onDelete}>
                            Delete
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;