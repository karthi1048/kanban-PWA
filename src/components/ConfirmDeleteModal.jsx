export default function ConfirmDeleteModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">
                    Delete Task?
                </h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this task?
                </p>
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
}