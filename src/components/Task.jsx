import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function Task({ task, col, onEdit, onDelete, onDragStart, onTouchStart, onDrop }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSave = () => {
        if(editText.trim() !== "") {
            onEdit(task.id, col, editText.trim());
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        setEditText(task.text);                                    // reset back to original text
        setIsEditing(false);                                       // exit editing
    }

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
                <div className="flex gap-2">
                    <input
                    className="flex-1 px-2 rounded text-white w-full"
                    value={ editText }
                    onChange={ (e) => setEditText(e.target.value) }/>
                    <button
                        className="bg-green-400 px-2 rounded hover:bg-green-600"
                        onClick={ handleSave }>
                        Save
                    </button>
                    <button
                        className="bg-gray-400 px-2 rounded hover:bg-gray-600"
                        onClick={ handleCancel }>
                        Cancel
                    </button>
                </div>
            ) : (
                <>
                    <span>{ task.text }</span>
                    <div className="flex gap-2 ml-2">
                        <button
                            className="bg-yellow-500 px-2 rounded hover:bg-yellow-700"
                            onClick={ () => setIsEditing(true) }>
                            Edit
                        </button>
                        <button
                            className="bg-red-600 px-2 rounded hover:bg-red-700"
                            onClick={ () => setShowConfirm(true) }>
                            Delete
                        </button>
                    </div>
                    { showConfirm && (
                        <ConfirmDeleteModal 
                            onConfirm={() => {
                                onDelete(task.id, col);
                                setShowConfirm(false);
                            }}
                            onCancel={ () => setShowConfirm(false) }/>
                    )}
                </>
            )}
        </div>
    )
}