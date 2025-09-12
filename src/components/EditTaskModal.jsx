import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function EditTaskModal({ 
    initialText="", 
    initialPriority="medium", 
    initialDueDate="",
    initialTags = [],
    isOpen, 
    onSave, 
    onCancel,
}) {
    
    const [text, setText] = useState(initialText);
    const [priority, setPriority] = useState(initialPriority);             // for changing the priority of tasks
    const [dueDate, setDueDate] = useState(initialDueDate || "");
    const [tags, setTags] = useState(initialTags);
    const [customTag, setCustomTag] = useState("");
    const [customColor, setCustomColor] = useState("#3b82f6");         // default color = blue
    // const modelRef = useRef(null);

    const predefinedTags = [
        { label: "Bugs", color: "#ef4444" },              // red
        { label: "Feature", color: "#22c55e" },           // green
    ];

    // To keep input synced when opening modal for different tasks
    useEffect(() => {
        setText(initialText);
        setPriority(initialPriority);
        setDueDate(initialDueDate);
        setTags(initialTags)
    }, [initialText, initialPriority, initialDueDate, initialTags]);

    useEffect(() => {
        if(!isOpen) return;
        
        // Checking keyboard shortcut & giving results for Save and Cancel
        const onKey = (e) => {
            if(e.key === "Escape") onCancel();
            if(e.key === "Enter" && !e.shiftKey){
                e.preventDefault();
                if(text.trim()) onSave(text.trim(), priority, dueDate || "", tags);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);

    }, [isOpen, text, priority, dueDate, tags, onSave, onCancel]);

    // gets predefined tags to sets as selected tags to add to a task
    const toggleTag = (tag) => {
        if(tags.find((t) => t.label === tag.label)){
            setTags(tags.filter((t) => t.label !== tag.label));
        } else {
            setTags([...tags, tag]);
        }
    };

    const handleCustomTagAdd = (e) => {
        e.preventDefault();
        if(!customTag.trim() || tags.find((t) => t.label === customTag.trim())) return;
        setTags([...tags, { label: customTag.trim(), color: customColor }]);
        setCustomTag("");
        setCustomColor("#3b82f6");
    };

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
                    {/* Task text */}
                    <textarea
                        autoFocus
                        value={text}
                        onChange={ (e) => setText(e.target.value) }
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
                    {/* Due Date */}
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input 
                        type="date"
                        value={ dueDate }
                        onChange={ (e) => setDueDate(e.target.value) }
                        className="border rounded px-2 py-1"/>
                    {/* Predefined Tags */}
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        { predefinedTags.map((tag) => (
                            <button
                                key={tag.label}
                                type="button"
                                onClick={ () => toggleTag(tag) }
                                className={`px-2 py-1 rounded-full text-xs border ${
                                    tags.find((t) => t.label === tag.label)
                                        ? "text-white border-transparent" 
                                        : "bg-gray-200 text-gray-700 border-gray-300"
                                }`}
                                style={{
                                    backgroundColor: tags.find((t) => t.label === tag.label) ? tag.color : "",
                                }}>
                            {tag.label}
                            </button>
                        ))}
                    </div>
                    {/* Custom tag input */}
                    <form onSubmit={handleCustomTagAdd} className="flex gap-2 mb-2">
                        <input 
                            type="text"
                            value={customTag}
                            onChange={ (e) => setCustomTag(e.target.value) }
                            placeholder="Add Custom tag"
                            className="border rounded px-2 py-1 flex-1 text-sm"/>
                        <input 
                            type="color"
                            value={customColor}
                            onChange={ (e) => setCustomColor(e.target.value) }
                            className="w-12 h-9 p-1 rounded cursor-pointer"/>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                            Add
                        </button>
                    </form>
                    {/* Selected tags preview */}
                    { tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                                    style={{ backgroundColor: tag.color }}>
                                {tag.label}
                                </span>
                            ))}
                        </div>
                    )}
                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-green-400 p-2 rounded text-sm hover:bg-green-600"
                            onClick={() => {
                                if(!text.trim()) return;
                                onSave(text.trim(), priority, dueDate || "", tags);
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