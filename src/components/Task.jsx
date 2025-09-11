import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditTaskModal from "./EditTaskModal";

export default function Task({ task, col, onEdit, onDelete, onDragStart, onTouchStart, onDrop }) {
    const [showConfirm, setShowConfirm] = useState(false);                        // for delete modal
    const [showEditModal, setShowEditModal] = useState(false);                    // for edit task modal
    const [expanded, setExpanded] = useState(false);                              // for toggling task text visibility

    // Used when modal saves new values
    const handleSaveFromModal = (newText, newPriority, newDueDate) => {
        onEdit(task.id, col, newText, newPriority, newDueDate);
        setShowEditModal(false);
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
            className="p-3 mb-2 bg-blue-400 text-white rounded-lg shadow cursor-move flex flex-col">

            {/* Task Text */}
            <span 
                className="break-words border p-2 m-1 cursor-pointer"
                title={ task.text }                                                 // shows tooltip(tasks content) on hover
                onClick={ () => setExpanded(!expanded) }
                onDoubleClick={ () => setShowEditModal(true) }
                >
                {/* on click show full text or reduce it to 50 characters */}
                { expanded
                    ? task.text
                    : task.text.length > 50
                    ? task.text.slice(0,50) + "..."
                    : task.text }
            </span>
            {/* Show Due date if available */}
            { task.dueDate && (
                <p 
                    className={`text-sm m-1 ${
                        new Date(task.dueDate) < new Date().setHours(0,0,0,0)
                        ? "text-red-700 bg-red-200 font-medium"                                 // overdue
                        : new Date(task.dueDate).toDateString() === new Date().toDateString()
                        ? "text-yellow-700 bg-yellow-200 font-medium"                           // due today
                        : "text-black bg-gray-200 font-medium"
                    }`}>
                    Due: { new Date(task.dueDate).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric", }) }
                </p>
            ) }
            {/* Timestamps */}
            <div className="py-2">
                {/* toLocaleString() uses browser's locale settings, so we use some options foe custom value */}
                { task.createdAt && (
                    <span className="text-xs text-black">
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
            </div>
            <div className="flex gap-3 my-2">
                {/* Priority */}
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
                    onClick={ () => setShowEditModal(true) }
                    aria-label="Edit task"
                    className="bg-yellow-500 px-2 rounded hover:bg-yellow-700">
                    🖋️
                </button>
                <button
                    onClick={ () => setShowConfirm(true) }
                    aria-label="Delete task"
                    className="bg-yellow-500 px-2 rounded hover:bg-yellow-700">
                    ✕
                </button>
            </div>

            {/* Edit modal */}
            <EditTaskModal
                isOpen={ showEditModal }
                initialText={ task.text }
                initialPriority={ task.priority }
                initialDueDate= { task.dueDate }
                onSave={ handleSaveFromModal }
                onCancel={ () => setShowEditModal(false) }
            />

            {/* Delete confirmation modal */}
            { showConfirm && (
                <ConfirmDeleteModal 
                    onConfirm={() => {
                        onDelete(task.id, col);                       // handleDeleteTask
                        setShowConfirm(false);
                    }}
                    onCancel={ () => setShowConfirm(false) }/>
                )
            }
        </div>
    );
}