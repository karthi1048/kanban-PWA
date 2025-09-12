import { useState, useRef } from "react";

export default function AddTask({ onAdd }) {
    const [value, setValue] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [tags, setTags] = useState([]);                              // empty array
    const [customTag, setCustomTag] = useState("");
    const [customColor, setCustomColor] = useState("#3b82f6");         // default color = blue
    const inputRef = useRef(null);

    const predefinedTags = [
        { label: "Bugs", color: "#ef4444" },              // red
        { label: "Feature", color: "#22c55e" },           // green
    ];

    const handleAdd = (e) => {
        e.preventDefault();
        if(!value.trim()) return;                               // .trim() used to avoid unnecessary spaces
        onAdd(value.trim(), priority, dueDate || "", tags);
        // Reset state values
        setValue("");
        setPriority("medium");
        setDueDate("");
        setTags([]);
        setCustomTag("");
        setCustomColor("#3b82f6");
        // To auto-focus after clearing input
        if(inputRef.current) inputRef.current.focus();
    };

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

    return (
        <div className="mb-2">
            {/* Text */}
            <input 
                type="text"
                ref={ inputRef }
                value={ value }
                onChange={ (e) => setValue(e.target.value) }
                onKeyDown={ (e) => e.key === "Enter" && handleAdd(e) }
                placeholder="New task..."
                className="border px-2 py-1 mr-2 rounded w-full mb-2"
                />
            {/* Priority */}
            <div>
                <select 
                    value={ priority } 
                    onChange={ (e) => setPriority(e.target.value) }
                    className="border rounded px-2 py-1 mb-2 w-full">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            {/* Predefined Tags */}
            <div className="mb-2">
                <p className="text-sm font-medium mb-1">Tags</p>
                <div className="flex flex-wrap gap-2">
                    { predefinedTags.map((tag) => (
                        <button
                            key={tag.label}
                            type="button"
                            onClick={ () => toggleTag(tag) }
                            className={`px-2 py-1 rounded-full text-xs border ${
                                tags.find((t) => t.label === tag.label) 
                                    ? "bg-blue-500 text-white border-blue-500" 
                                    : "bg-gray-200 text-gray-700 border-gray-300"
                            }`}
                            style={{ backgroundColor: tags.find((t) => t.label === tag.label) ? tag.color : "" }}>
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>
            {/* Custom tag input */}
            <form onSubmit={handleCustomTagAdd} className="flex gap-2 mb-2 items-center">
                <input 
                    type="text"
                    value={customTag}
                    onChange={ (e) => setCustomTag(e.target.value) }
                    placeholder="Add Custom tag"
                    className="border rounded px-2 py-1 flex-1 text-sm"
                />
                <input 
                    type="color"
                    value={customColor}
                    onChange={ (e) => setCustomColor(e.target.value) }
                    className="w-10 h-10 p-1 rounded cursor-pointer"/>
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
            {/* DueDate */}
            <input 
                type="date"
                value={ dueDate }
                onChange={ (e) => setDueDate(e.target.value) }
                // placeholder="Pick due date..."
                className="border px-2 py-2 rounded-lg"
            />
            {/* Add Task Btn */}
            <button 
                onClick={ handleAdd }
                className="bg-green-400 hover:bg-green-600 text-white px-3 py-1 rounded-lg">
                    Add Task
            </button>
        </div>
    )
}