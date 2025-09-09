import { useEffect, useState, useRef } from "react";

export default function EditTaskModal({ initialText="", initialPriority="medium", isOpen, onSave, onCancel }) {
    const [text, setText] = useState(initialText);
    const [priority, setPriority] = useState(initialPriority);             // for changing the priority of tasks
    const modelRef = useRef(null);

    // To keep input synced when opening modal for different tasks
    useEffect(() => {
        setText(initialText);
        setPriority(initialPriority);
    }, [initialText, initialPriority]);

    useEffect(() => {
        if(!isOpen) return;

        const onKey = (e) => {
            if(e.key === "Escape") onCancel();
            if(e.key === "Enter"){
                e.preventDefault();
                if(text.trim()) onSave(text.trim(), priority);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);

    }, [isOpen, text, priority, onSave, onCancel]);

    if(!isOpen) return null;                          // if modal is not open return null

    return (
        <div
            ref={ modelRef }
            onClick={ (e) => e.stopPropagation() }
            draggable={ false }                          // to block accidental drag
            className="fixed inset-0 flex items-center justify-center z-10 select-none cursor-default">
            {/* Modal Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={ onCancel }
                draggable={ false }
                aria-hidden="true">
            </div>
            {/* Modal content */}
            <div
                onClick={ (e) => e.stopPropagation() } // prevent backdrop close
                className="relative bg-white text-black p-6 rounded-xl shadow-xl max-w-md w-full">
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
    )
}
