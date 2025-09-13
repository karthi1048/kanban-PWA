import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditTaskModal from "./EditTaskModal";

export default function Task({ task, col, onEdit, onDelete, onDragStart, onTouchStart, onDrop, onToggleSubTask }) {
    const [showConfirm, setShowConfirm] = useState(false);                        // for delete modal
    const [showEditModal, setShowEditModal] = useState(false);                    // for edit task modal
    const [expanded, setExpanded] = useState(false);                              // for toggling task text visibility
    const [showSubTasks, setShowSubTasks] = useState(false);                      // for toggling subtask visibility

    // Used when modal saves new values
    const handleSaveFromModal = (newText, newPriority, newDueDate, newTags, newSubTasks) => {
        onEdit(task.id, col, newText, newPriority, newDueDate, newTags, newSubTasks);
        setShowEditModal(false);
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
            {/* Tags */}
            { task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                            style={{ backgroundColor: tag.color || "#6b7280" }}>     {/* fallback = gray if no customColor */}
                            {tag.label}
                        </span>
                    ))}
                </div>
            )}
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
                {/* Modal buttons */}
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
            {/* Subtasks toggle btns */}
            { task.subtasks && task.subtasks.length > 0 && (
                <button
                    onClick={ () => setShowSubTasks(!showSubTasks) }
                    className="text-xs self-start mt-1">
                    { showSubTasks 
                        ? "Hide subtasks 🔺" 
                        : `Show subtasks - (${task.subtasks.filter(sub => sub.done).length}/${task.subtasks.length}) 🔻` 
                    }
                    {/* Show subtasks - (done tasks/total tasks) */}
                </button>
            )}
            {/* Subtasks list */}
            { showSubTasks && task.subtasks && task.subtasks.length > 0 && (
                <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium mb-1">Subtasks</p>
                    <ul className="space-y-1">
                        {task.subtasks.map((sub, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2">
                                <input 
                                    type="checkbox"
                                    checked={sub.done}
                                    onChange={ () => onToggleSubTask(task.id, index) }/>
                                <span className={`text-sm ${sub.done ? "line-through text-gray-500" : ""}`}>
                                    {sub.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) }

            {/* Edit modal */}
            <EditTaskModal
                isOpen={ showEditModal }
                initialText={ task.text }
                initialPriority={ task.priority }
                initialDueDate= { task.dueDate }
                initialTags={ task.tags || [] }                       // pass tags if available or just get empty array
                initialSubTasks={ task.subtasks || [] }
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