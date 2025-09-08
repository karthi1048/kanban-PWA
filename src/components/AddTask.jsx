import { useState, useRef } from "react";

export default function AddTask({ onAdd }) {
    const [value, setValue] = useState("");
    const [priority, setPriority] = useState("medium");
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!value.trim()) return;     // .trim() used to avoid unnecessary spaces
        onAdd(value.trim(), priority);
        // Reset state values
        setValue("");
        setPriority("medium");   
        // To auto-focus after clearing input
        if(inputRef.current){
            inputRef.current.focus();
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="flex my-4">
            <input 
                type="text"
                ref={ inputRef }
                value={ value }
                onChange={ (e) => setValue(e.target.value) }
                placeholder="New task..."
                className={`border text-sm p-2 rounded-lg shadow-sm focus:outline-none w-full
                            focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
                />
            <select 
                value={ priority } 
                onChange={ (e) => setPriority(e.target.value) }
                className="border rounded-l-lg px-2 py-1">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button 
                type="submit"
                className="bg-green-400 hover:bg-green-600 px-3 rounded-r-lg">
                    ➕
            </button>
        </form>
    )
}