import { useState, useEffect } from 'react';
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

  // to track which column is being hovered
  const [dragOverCol, setDragOverCol] = useState(null);

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
    e.dataTransfer.effectAllowed = "move";                // to hint it's a move operation.                 
  };

  /*
  => dataTransfer only stores strings. If need 'objects', use JSON.stringify() for storing & JSON.parse() on drop.
  => Can call e.dataTransfer.setDragImage(node, x, y) for custom drag preview.
  */

  // Used when dragged element is dropped on column.
  const handleDrop = (e, toCol, targetTaskId = null) => {
    e.preventDefault();

    const raw = e.dataTransfer.getData("application/json");     // retrieve stored element identifier & source column
    if(!raw) return;

    const { id, from } = JSON.parse(raw);
    if(!id) return;                                             // Don't allow drop if same id

    // to update state based on previous value
    setBoard((prev) => {
      // Create a shallow copy(clone), so react sees new object reference & re-renders.
      const newBoard = { ...prev };

      // Check if the task(dragged element) exists in target column
      // If yes, then reordering case - remove task(element) first so it does not duplicate, then reinsert at later
      // If no, then remove task(element) from its original column.
      // Note: we remove using the id
      if(newBoard[toCol].some((t) => t.id === id)){
        newBoard[toCol] = newBoard[toCol].filter((t) => t.id !== id);
      } else {
        newBoard[from] = newBoard[from].filter((t) => t.id !== id);
      }

      // Get the dragged task(element) by id, looking in either source or target column
      const task = prev[from].find((t) => t.id === id) || prev[toCol].find((t) => t.id === id);
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
          newBoard[toCol].splice(targetIndex, 0, task);          // insert before target in the column
        }
      } else {
        newBoard[toCol] = [...newBoard[toCol], task];            // default - append at end, while moving to new columns
      }

      return newBoard;                                           // new state result of board, re-render occurs.
    });

    setDragOverCol(null);                                        // reset the highlight after drop
  };

  /*
  => e.preventDefault() can be called at either top of handleDrop() or in onDragOver, to prevent default browser behaviors.
  => setBoard() does immutable updates, since react detect change by comparing object references.
  => dataTransfer.setData(type, data) API expects a "MIME type" as first argument. So using 'application/json' is just a convention to tell we are using structured JSON data(format) for sending & receiving.
  */

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
            className={`flex-1 rounded-2xl shadow-md p-4 transition-colors 
              ${dragOverCol === col ? "bg-blue-100" : "bg-white"}`}
            onDragOver={ (e) => e.preventDefault() }   // to allow dropping
            onDrop={(e) => {
              handleDrop(e, col);
            }}
            onDragEnter={ () => setDragOverCol(col) }
            onDragLeave={ () => setDragOverCol(null)}>
            <h2 className='text-xl font-bold mb-4'>{col}</h2>
            {/* Similar to columns, return div for each task */}
            { tasks.map((task) => (
              <div 
                draggable
                key={task.id}
                onDragStart={ (e) => handleDragStart(e, task, col) }
                onDragOver={ (e) => e.preventDefault() }
                onDrop={(e) => {
                  e.stopPropagation();                        // prevent column onDrop
                  handleDrop(e, col, task.id);                // reorder or insert before this task(element) id at hover end
                }}           
                className='p-3 mb-2 bg-blue-500 text-white rounded-lg shadow cursor-move'>
                {task.text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
