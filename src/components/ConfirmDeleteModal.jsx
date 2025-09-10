import { createPortal } from "react-dom";

export default function ConfirmDeleteModal({ onConfirm, onCancel }) {

    const modal = (
        <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                onClick={ onCancel }
                onDragStart={ (e) => { e.preventDefault(); e.stopPropagation(); }}
                aria-hidden="true"
                draggable={ false }
                className="absolute inset-0 bg-black/50">
            </div>
            {/* Content */}
            <div
                onClick={ (e) => e.stopPropagation() }
                onDragStart={ (e) => { e.preventDefault(); e.stopPropagation(); }}
                draggable={ false }
                className="relative bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full z-10"
                style={{ cursor:"default" }}>

                <h2 className="text-lg font-semibold mb-4">Delete Task?</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this task?</p>

                <div className="flex justify-center gap-4">
                    <button 
                        onClick={ onConfirm }
                        className="bg-red-500 text-white px-4 py-2 rounded-b-lg hover:bg-red-600">
                        Yes, Delete
                    </button>
                    <button 
                        onClick={ onCancel }
                        className="bg-gray-500 text-white px-4 py-2 rounded-b-lg hover:bg-gray-600">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
// Using React portal, we are moving modal outside the "div with id"(created for <App/> jsx element) into the body directly.
// So this will separate its attachment with draggable components, thus avoiding dragging of modal.