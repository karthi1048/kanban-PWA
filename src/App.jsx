import { useState, useEffect, useRef } from 'react';
import AddTask from './components/AddTask';
import Task from './components/Task';
import './App.css'

export default function App() {

  // Load from localStorage if available, else use the defaults
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem("board");
    return saved ? JSON.parse(saved) : {
      "To DO": [
        {id:'t1', text:"Task 1"}, 
        {id:'t2', text:"Task 2"},
      ],
      "In Progress": [{id:'t3', text:"Task 3"}],
      "Done": [{id:'t4', text:"Task 4"}],
    };
  });
  // Column names: Array of tasks

  const [dragOverCol, setDragOverCol] = useState(null);               // to track which column is being hovered
  const touchTaskRef = useRef(null);                                  // store dragged task during 
  const [ghostTask, setGhostTask] = useState(null);                   // temporary state used for touch

  // Save to localStorage whenever board changes
  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(board));
  }, [board]);
  
  // NOTE: Utilizing "DragEvent API" for drag & drop 
  // e is React's SyntheticEvent wrapping Native Events.

  // Used to store the dragged element info, while user drag a element
  const handleDragStart = (e, task, fromCol) => {
    // stores string value(i.e, unique id or text) on drag operation.
    // stores the source column id/name to tell drop handler where the dragged element's from.
    e.dataTransfer.setData(                                     
      "application/json", 
      JSON.stringify({ id: task.id, from: fromCol })
    );                       
    e.dataTransfer.effectAllowed = "move";                            // to hint it's a move operation.                 
  };

  /*
  => dataTransfer only stores strings. If need 'objects', use JSON.stringify() for storing & JSON.parse() on drop.
  => Can call e.dataTransfer.setDragImage(node, x, y) for custom drag preview.
  */

  // Drop handler for touch or drag
  // Used when dragged element is dropped on column.
  const handleDrop = (e, toCol, targetTaskId = null, fromCol = null, taskId = null) => {
    if(e) e.preventDefault();

    const payload = (
      taskId && fromCol 
        ? { id: taskId, from: fromCol }                               // from touch
        : JSON.parse(e.dataTransfer.getData("application/json"))      // from mouse (drag)
    );
    // retrieves stored element identifier & source column

    if(!payload?.id) return;

    // To update state based on previous value
    setBoard((prev) => {
      // Create a shallow copy(clone), so react sees new object reference & re-renders.
      const newBoard = { ...prev };

      // Check if the task(dragged element) exists in target column
      // If yes, then reordering case - remove task(element) first so it does not duplicate, then reinsert at later
      // If no, then remove task(element) from its original column.
      // Note: we remove using the id
      if(newBoard[toCol].some((t) => t.id === payload.id)){
        newBoard[toCol] = newBoard[toCol].filter((t) => t.id !== payload.id);
      } else {
        newBoard[payload.from] = newBoard[payload.from].filter((t) => t.id !== payload.id);
      }

      // Get the dragged task(element) by id, looking in either source or target column
      const task = (
        prev[payload.from].find((t) => t.id === payload.id) || 
        prev[toCol].find((t) => t.id === payload.id)
      );
      // if not found, return the unchanged board(previous state).
      if (!task) return prev;
      
      // Inserting task into position
      // If dropped on another task, insert dragged task before the task.
      // If dropped on empty space in column, default - append at end.
      if(targetTaskId) {
        const targetIndex = newBoard[toCol].findIndex(
          (t) => t.id === targetTaskId
        );
        // if not found (it shouldn't happen), append
        if(targetIndex === -1){
          newBoard[toCol] = [...newBoard[toCol], task];
        } else {
          newBoard[toCol].splice(targetIndex, 0, task);                                     // insert before target in the column
        }
      } else {
        newBoard[toCol] = [...newBoard[toCol], task];                                       // default - append at end, while moving to new columns
      }

      return newBoard;                                                                      // new state result of board, re-render occurs.
    });

    setDragOverCol(null);                                                                   // reset the highlight after drop
  };

  /*
  => e.preventDefault() can be called at either top of handleDrop() or in onDragOver, to prevent default browser behaviors.
  => setBoard() does immutable updates, since react detect change by comparing object references.
  => dataTransfer.setData(type, data) API expects a "MIME type" as first argument. So using 'application/json' is just a convention to tell we are using structured JSON data(format) for sending & receiving.
  */

  // Touch handlers
  const handleTouchStart = (task, fromCol) => {
    touchTaskRef.current = { id: task.id, from: fromCol };                                  // store id & column as Reference(to remember) as its current.
    setGhostTask({ ...task, x:0, y:0 });                                                    // create ghost with values id, text ,x, y as values
  };

  const handleTouchEnd = (e) => {
    // check if touchTaskRef store anything, if not rest ghostTask (GUARD)
    if(!touchTaskRef.current){
      setGhostTask(null);
      return;
    }

    // Get position when finger lifts.
    const touch = e.changedTouches[0];                                                      // Gives the finger last position on screen
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);          // returns DOM element directly under the finger position.

    // Find nearest column container(div), if not reset & stop
    const colDiv = targetElement?.closest("[data-col]");                                    // from that task(element) climb the DOM tree, find the column with value "data-col"
    if(!colDiv){ 
      touchTaskRef.current = null;
      setDragOverCol(null);
      setGhostTask(null);
      return;
    }
    const toCol = colDiv.getAttribute("data-col");                                          // Get the column name from that attribute.

    handleDrop(null, toCol, null, touchTaskRef.current.from, touchTaskRef.current.id);      
    touchTaskRef.current = null;                                                            // clear out the reference, to avoid trouble for next.
    setDragOverCol(null);
    setGhostTask(null);                                                                     // remove ghost
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];                                                             // gives current finger coordinates
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const colDiv = targetElement?.closest("[data-col]");
    if(colDiv) {
      setDragOverCol(colDiv.getAttribute("data-col"));                                      // gets which column is under finger
    } else {
      setDragOverCol(null);
    }

    // move the ghost to follow the finger every frame
    if(ghostTask) {
      setGhostTask((prev) => ({ ...prev, x: touch.clientX, y: touch.clientY }));
    }
  };

  // CRUD handlers

  // add new task to column
  // NOTE: uses now() for id, which gives milliseconds & text from input
  const handleAddTask = (col, text) => {
    setBoard((prev) => ({
      ...prev,
      [col]: [...prev[col], { id: Date.now().toString(), text }],
    }));
  };

  const handleEditTask = (taskId, col, newText) => {
    setBoard((prev) => ({
      ...prev,
      [col]: prev[col].map((t) => t.id === taskId ? { ...t, text: newText} : t),
    }));
  };

  const handleDeleteTask = (taskId, col) => {
    setBoard((prev) => ({
      ...prev,
      [col]: prev[col].filter((t) => t.id !== taskId),
    }))
  }

  return (
    <>
      {/* <h1 className='text-3xl m-4 font-bold'>Kanban</h1> */}

      {/* Board */}
      <div className='flex h-screen bg-gray-100 p-6 gap-6'>
        {/* Get [key, value], destructure as [col, tasks] & return div for each column*/}
        { Object.entries(board).map(([col, tasks]) => (
          // Columns
          // we use 'conditional tailwind classes' to highlight columns, while element(task) hover.
          <div 
            key={col}
            data-col={col}                                    // mark column div
            onDragOver={ (e) => e.preventDefault() }          // to allow dropping
            onDrop={(e) => {
              handleDrop(e, col);
            }}
            onDragEnter={ () => setDragOverCol(col) }
            onDragLeave={ () => setDragOverCol(null)}
            onTouchMove={ handleTouchMove }                   // highlight column on touch & ghost move
            onTouchEnd={ handleTouchEnd }                     // drop the column by global detection
            className={`flex-1 rounded-2xl shadow-md p-4 transition-colors 
              ${dragOverCol === col ? "bg-blue-100" : "bg-white"}`}>          
            <h2 className='text-xl font-bold mb-4'>{col}</h2>
            {/* AddTask below each input */}
            <AddTask onAdd={ (text) => handleAddTask(col, text) }/>
            {/* Similar to columns, return div for each task */}
            { tasks.map((task) => (
              <Task 
                key={ task.id }
                task={task}
                col={col}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDragStart={handleDragStart}
                onTouchStart={handleTouchStart}
                onDrop={handleDrop}/>
            )) }
          </div>
        )) }

        {/* Conditional Ghost task */}
        { ghostTask && (
          <div
            // "pointer-events-none => it never intercepts touches/clicks"
            className='fixed pointer-events-none bg-blue-500 text-white p-3 rounded-lg shadow-lg opacity-80'
            style={{
              top: ghostTask.y - 30 + "px",
              left: ghostTask.x - 60 + "px",
            }}>
            { ghostTask.text }
          </div>
        )}
      </div>
    </>
  )
};
