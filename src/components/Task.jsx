import { useState } from "react";

export default function Task({ task, col, onEdit, onDelete, onDragStart, onTouchStart, onDrop }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleSave = () => {
        if(editText.trim() !== ""){
            onEdit(task.id, col, editText.trim());
            setIsEditing(false);
        }
    };

    return (
        <div
            key={ task.id }
            draggable
            onDragStart={ (e) => onDragStart(e, task, col) }
            onDragOver={ (e) => e.preventDefault() }
            onDrop={ (e) => {
                e.preventDefault();                                 // prevent column onDrop
                onDrop(e, col, task.id);                            // reorder or insert before this task(element) id at hover end
            }}
            onTouchStart={ () => onTouchStart(task, col) }          // pick the task
            className="p-3 mb-2 bg-blue-500 text-white rounded-lg shadow cursor-move flex justify-between items-center">
            { isEditing ? (
                <div className="flex gap-2 w-full">
                    <input
                    className="flex-1 px-2 rounded text-black"
                    value={ editText }
                    onChange={ (e) => setEditText(e.target.value) }/>
                    <button
                        className="bg-green-600 px-2 rounded"
                        onClick={ handleSave }>
                        Save
                    </button>
                </div>
            ) : (
                <>
                    <span>{ task.text }</span>
                    <div className="flex gap-2 ml-2">
                        <button
                            className="bg-yellow-500 px-2 rounded"
                            onClick={ () => setIsEditing(true) }>
                            Edit
                        </button>
                        <button
                            className="bg-red-600 px-2 rounded"
                            onClick={ () => onDelete(task.id, col) }>
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}