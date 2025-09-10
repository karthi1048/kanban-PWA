import { useState, useRef } from "react";

export default function AddTask({ onAdd }) {
    const [value, setValue] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!value.trim()) return;     // .trim() used to avoid unnecessary spaces
        onAdd(value.trim(), priority, dueDate || "");
        // Reset state values
        setValue("");
        setPriority("medium");
        setDueDate("");
        // To auto-focus after clearing input
        if(inputRef.current){
            inputRef.current.focus();
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="flex flex-col gap-2 mb-2">
            <input 
                type="text"
                ref={ inputRef }
                value={ value }
                onChange={ (e) => setValue(e.target.value) }
                placeholder="New task..."
                className="border px-2 py-2 rounded-lg focus:outline-none focus:ring w-full"
                />
            <div className="flex gap-2">
                <select 
                    value={ priority } 
                    onChange={ (e) => setPriority(e.target.value) }
                    className="border rounded-lg px-2 py-1">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <input 
                type="date"
                // ref={ inputRef }
                value={ dueDate }
                onChange={ (e) => setDueDate(e.target.value) }
                // placeholder="New task..."
                className="border px-2 py-2 rounded-lg"
            />
            <button 
                type="submit"
                className="bg-green-400 hover:bg-green-600 text-white px-3 py-1 rounded-lg">
                    Add Task
            </button>
        </form>
    )
}