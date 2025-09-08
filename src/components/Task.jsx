import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function Task({ task, col, onEdit, onDelete, onDragStart, onTouchStart, onDrop }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [editPriority, setEditPriority] = useState(task.priority || "medium");
    const [showConfirm, setShowConfirm] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleSave = () => {
        if(editText.trim() !== "") {
            onEdit(task.id, col, editText.trim(), editPriority);
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        setEditText(task.text);                                    // reset back to original
        setEditPriority(task.priority);
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
            className="p-3 mb-2 bg-blue-400 text-white rounded-lg shadow cursor-move">
            { isEditing ? (
                <div className="flex flex-col space-x-2">
                    <input
                        className={`border mb-2 p-2 rounded-lg shadow-sm focus:outline-none w-full
                                    focus:ring-2 focus:ring-red-400 focus:border-red-400 transition`}
                        // className="px-2 py-1 rounded border text-white mb-2"
                        value={ editText }
                        onChange={ (e) => setEditText(e.target.value) }/>
                    <select 
                        value={ editPriority } 
                        onChange={ (e) => setEditPriority(e.target.value) }
                        className="border rounded px-2 py-1 my-2 text-black">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <div className="flex space-x-2">
                        <button
                            className="bg-green-400 px-2 rounded text-sm hover:bg-green-600"
                            onClick={ handleSave }>
                            Save
                        </button>
                        <button
                            className="bg-gray-400 px-2 rounded text-sm hover:bg-gray-600"
                            onClick={ handleCancel }>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col">
                    {/* Task text */}
                    <span 
                        className="mb-4 rounded border p-2 cursor-pointer"
                        title={ task.text }                                                 // shows tooltip(tasks content) on hover
                        onClick={ () => setExpanded(!expanded) }
                        onDoubleClick={ () => setIsEditing(true) }>
                        {/* on click show full text or reduce it to 50 characters */}
                        { expanded
                            ? task.text
                            : task.text.length > 50
                            ? task.text.slice(0,50) + "..."
                            : task.text }
                    </span>
                    {/* Timestamps */}
                    {/* toLocaleString() uses browser's locale settings, so we use some options foe custom value */}
                    { task.createdAt && (
                        <span className="text-xs text-black mb-2">
                            "Created":{" "} 
                            { new Date(task.createdAt).toLocaleString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }) }
                            { task.updatedAt && (
                                <span>
                                    {" "}| "Edited":{" "} 
                                    { new Date(task.updatedAt).toLocaleString([], {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }) }
                                </span>
                            ) }
                        </span>
                    ) }
                    <div className="flex items-center space-x-2">
                        { task.priority && (
                            <span
                                className={`px-2 py-0.5 rounded text-xs font-semibold
                                    ${ task.priority === "high"
                                        ? "bg-red-200 text-red-700"
                                        : task.priority === "medium"
                                        ? "bg-yellow-200 text-yellow-700"
                                        : "bg-green-200 text-green-700"
                                    }`}>
                                { task.priority }
                            </span>
                        ) }
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
                        { showConfirm && (
                            <ConfirmDeleteModal 
                                onConfirm={() => {
                                    onDelete(task.id, col);
                                    setShowConfirm(false);
                                }}
                                onCancel={ () => setShowConfirm(false) }/>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}