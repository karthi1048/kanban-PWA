import Task from "./Task";
import AddTask from "./AddTask";

export default function Column({
    col,
    tasks = [],
    // drag state & setter props
    dragOverCol,
    setDragOverCol,
    // drag/touch handler props
    handleDrop,
    handleTouchMove,
    handleTouchEnd,
    handleDragStart,
    handleTouchStart,
    // CRUD handler props
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    // search query from App.jsx
    searchQuery = "",
    // sort props
    sortOrder,
    setSortOrder,
}) {

    const query = (searchQuery || "").trim().toLowerCase();                  // input from search bar

    // Filter code first, then sort code

    // if query, use "filtered" else use "tasks"
    let filtered = query 
        ? tasks.filter((task) => {
            const text = (task?.text || "").toLowerCase();
            const priority = (task?.priority || "").toLowerCase();
            return text.includes(query) || priority.includes(query)
        })
        : tasks;
    
    // Sort conditions
    if(sortOrder != "default"){
        filtered = [...filtered].sort((a,b) => {
            if(sortOrder === "date-DESC"){
                return (new Date(b.createdAt) - new Date(a.createdAt));
            }
            if(sortOrder === "date-ASC"){
                return (new Date(a.createdAt) - new Date(b.createdAt));
            }
            if(sortOrder === "priority-DESC"){
                const order = { high:3, medium:2, low:1 };
                return (order[b.priority] || 0) - (order[a.priority] || 0);
            }
            if(sortOrder === "priority-ASC"){
                const order = { high:3, medium:2, low:1 };
                return (order[a.priority] || 0) - (order[b.priority] || 0);
            }
            return 0;
        });
    }
    
    return (
        <div 
            data-col={col}                                    // mark column div
            onDragOver={ (e) => e.preventDefault() }          // to allow dropping
            onDrop={(e) => { handleDrop(e, col) }}
            onDragEnter={ () => setDragOverCol(col) }
            onDragLeave={ () => setDragOverCol(null)}
            onTouchMove={ handleTouchMove }                   // highlight column on touch & ghost move
            onTouchEnd={ handleTouchEnd }                     // drop the column by global detection
            // we use 'conditional tailwind classes' to highlight columns, while element(task) hover.
            // Due to "overflow-y-auto" each column will have independent scrolls, when tasks overflow their column div site
            className={`flex-1 rounded-2xl shadow-md p-4 transition-colors max-h-[80vh] overflow-y-auto
                        ${dragOverCol === col ? "bg-blue-100" : "bg-white"}`}>

            {/* Column header & sort */}
            <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-mono'>{col}</h2>
                <select
                    value={ sortOrder }
                    onChange={ (e) => setSortOrder(e.target.value) }
                    className="border rounded px-2 py-1 text-sm">
                    <option value="default">Default</option>
                    <option value="date-DESC">Newest first</option>
                    <option value="date-ASC">Oldest first</option>
                    <option value="priority-DESC">Priority High → Low</option>
                    <option value="priority-ASC">Priority Low → High</option>
                </select>
            </div>

            {/* AddTask below each input */}
            <AddTask onAdd={ (text, priority, dueDate) => handleAddTask(col, text, priority, dueDate) }/>
            
            {/* Similar to columns, return div for each task */}
            <div className="mt-3 space-y-2">
                { filtered.map((task) => (
                    <Task 
                        key={ task.id }
                        task={task}
                        col={col}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onDragStart={handleDragStart}
                        onTouchStart={handleTouchStart}
                        onDrop={handleDrop}/>
                    ))
                }
            </div>
            {/* NOTE: map() is used to return the tasks in board, filter() is used to get filtered tasks on board by searchQuery */}
        </div>
    )
}