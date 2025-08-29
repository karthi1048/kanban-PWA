import { useState } from 'react';
import './App.css'

export default function App() {
  // Column names: Array of tasks
  const [board, setBoard] = useState({
    "To DO": ["Task 1", "Task 2"],
    "In Progress": ["Task 3"],
    "Done": ["Task 4"],
  });
  
  // NOTE: Utilizing "DragEvent API" for drag & drop 
  // e is React's SyntheticEvent wrapping Native Events.

  // To store the dragged element info, while user drag a element
  const handleDragStart = (e, task, fromCol) => {
    e.dataTransfer.setData("task", task);                       // stores string value(i.e, unique internal text) on drag operation.
    e.dataTransfer.setData("fromCol", fromCol);                 // stores the source column id/name to tell drop handler where the dragged element's from.
  };

  /*
  => dataTransfer only stores strings. If need 'objects', use JSON.stringify() for storing & JSON.parse() on drop.
  => Can set e.dataTransfer.effectAllowed = "move" to hint it's a move operation.
  => Can call e.dataTransfer.setDragImage(node, x, y) for custom drag preview.
  */

  // Used when dragged element is dropped on another column.
  const handleDrop = (e, toCol) => {
    const task = e.dataTransfer.getData("task");                // retrieve stored element identifier.
    const fromCol = e.dataTransfer.getData("fromCol");          // retrieve the source column

    if(!task || !fromCol) return;   // to check invalid drops
    if(fromCol === toCol) return;   // Don't allow drop if same column (NOTE: change it to allow reordering in future.)

    setBoard((prev) => {
      // Create a shallow copy, so react sees new object reference & re-renders.
      const newBoard = { ...prev };
      // remove element from old column by filtering out the dragged or moved one.
      newBoard[fromCol] = newBoard[fromCol].filter((t) => t !== task);
      // append it to new column(toCol)
      newBoard[toCol] = [...newBoard[toCol], task];
      return newBoard;
    });
  };

  /*
  => e.preventDefault() can be called at either top of handleDrop() or in onDragOver, to prevent default browser behaviors.
  => setBoard() does immutable updates, since react detect change by comparing object references.
  */

  return (
    <>
      {/* <h1 className='text-3xl m-4 font-bold'>Kanban</h1> */}

      {/* Board */}
      <div className='flex h-screen bg-gray-100 p-6 gap-6'>
        {/* Get [key, value], destructure as [col, tasks] & return div for each column*/}
        { Object.entries(board).map(([col, tasks]) => (
          // Columns
          <div 
            key={col} 
            className='flex-1 bg-white rounded-2xl shadow-md p-4'
            onDragOver={ (e) => e.preventDefault() }   // to allow dropping
            onDrop={ (e) => handleDrop(e, col) }>
            <h2 className='text-xl font-bold mb-4'>{col}</h2>
            {/* Similar to columns, return div for each task */}
            { tasks.map((task) => (
              <div 
                draggable
                key={task}
                onDragStart={ (e) => handleDragStart(e, task, col) }
                className='p-3 mb-2 bg-blue-500 text-white rounded-lg shadow cursor-move'>
                {task}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
