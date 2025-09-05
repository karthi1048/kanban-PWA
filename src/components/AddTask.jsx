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
        <form onSubmit={ handleSubmit } className="flex my-2">
            <input 
                type="text"
                ref={ inputRef }
                value={ value }
                onChange={ (e) => setValue(e.target.value) }
                placeholder="New task..."
                className="flex-1 border rounded-lg p-2 text-sm"/>
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