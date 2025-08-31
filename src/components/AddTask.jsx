import { useState  } from "react";

export default function AddTask({ onAdd }) {
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!value.trim()) return;     // .trim() used to avoid unnecessary spaces
        onAdd(value);
        setValue("");
    };

    return (
        <form onSubmit={ handleSubmit } className="flex my-2">
            <input 
                type="text"
                value={ value }
                onChange={ (e) => setValue(e.target.value) }
                placeholder="New task..."
                className="flex-1 border rounded-l-lg p-2 text-sm"/>
            <button 
                type="submit"
                className="bg-green-500 text-white px-3 rounded-r-lg text-sm">
                    ➕
            </button>
        </form>
    )
}