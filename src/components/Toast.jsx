import { useEffect } from "react";

export default function Toast({ message, actionLabel, onAction, onClose, duration=6000 }) {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
            <span>{ message }</span>
            { actionLabel && (
                <button
                    onClick={onAction}
                    className="underline text-blue-300 hover:text-blue-200">
                    { actionLabel }
                </button>
            )}
        </div>
    );
}