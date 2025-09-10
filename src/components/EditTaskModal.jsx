import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function EditTaskModal({ initialText="", initialPriority="medium", isOpen, onSave, onCancel }) {
    const [text, setText] = useState(initialText);
    const [priority, setPriority] = useState(initialPriority);             // for changing the priority of tasks
    // const modelRef = useRef(null);

    // To keep input synced when opening modal for different tasks
    useEffect(() => {
        setText(initialText);
        setPriority(initialPriority);
    }, [initialText, initialPriority]);

    useEffect(() => {
        if(!isOpen) return;

        const onKey = (e) => {
            if(e.key === "Escape") onCancel();
            if(e.key === "Enter" && !e.shiftKey){
                e.preventDefault();
                if(text.trim()) onSave(text.trim(), priority);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);

    }, [isOpen, text, priority, onSave, onCancel]);

    if(!isOpen) return null;                          // if modal is not open return null

    const modal = (
        <div
            // ref={ modelRef }
            className="fixed inset-0 flex items-center justify-center z-10" role="dialog" aria-modal="true">
            {/* Modal Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={ onCancel }
                onDragStart={ (e) => { e.preventDefault(); e.stopPropagation(); } }
                draggable={ false }
                aria-hidden="true">
            </div>
            {/* Modal content */}
            <div
                onClick={ (e) => e.stopPropagation() } // prevent backdrop
                draggable={ false }
                onDragStart={ (e) => { e.preventDefault(); e.stopPropagation(); } }
                className="relative bg-white text-black p-6 rounded-xl shadow-xl max-w-md w-full"
                style={{ cursor:"default", userSelect:"auto" }}>
                    <h2 className="text-lg font-semibold mb-3">Edit Task</h2>
                    <textarea
                        autoFocus
                        value={text}
                        onChange={ (e) => setText(e.target.value) }
                        placeholder="Edit Task Text..."
                        className="w-full border rounded p-2 mb-3 text-sm resize-y min-h-[64px]"
                    />
                    {/* Priority selection */}
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select 
                        value={ priority } 
                        onChange={ (e) => setPriority(e.target.value) }
                        className="border rounded p-2 mb-4 text-sm">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-green-400 p-2 rounded text-sm hover:bg-green-600"
                            onClick={() => {
                                if(!text.trim()) return;
                                onSave(text.trim(), priority);
                            } }>
                            Save
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 p-2 rounded text-sm hover:bg-gray-600"
                            onClick={ onCancel }>
                            Cancel
                        </button>
                    </div>
            </div>
            {/* <input
                className={`border mb-2 p-2 rounded-lg shadow-sm focus:outline-none w-full
                            focus:ring-2 focus:ring-red-400 focus:border-red-400 transition`}
                />
             */}
        </div>
    );

    return createPortal(modal, document.body);
}
// Using React portal, we are moving modal outside the "div with id"(created for <App/> jsx element) into the body directly.
// So this will separate its attachment with draggable components, thus avoiding dragging of modal.