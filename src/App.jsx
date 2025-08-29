import './App.css'

export default function App() {
  // Column names: Array of tasks
  const board = {
    "To DO": ["Task 1", "Task 2"],
    "In Progress": ["Task 3"],
    "Done": ["Task 4"],
  }

  return (
    <>
      {/* <h1 className='text-3xl m-4 font-bold'>Kanban</h1> */}

      {/* Board */}
      <div className='flex h-screen bg-gray-100 p-6 gap-6'>
        {/* Get [key, value] & destructure as [col, tasks] & return div for each column*/}
        { Object.entries(board).map(([col, tasks]) => (
          // Columns
          <div key={col} className='flex-1 bg-white rounded-2xl shadow-md p-4'>
            <h2 className='text-xl font-bold mb-4'>{col}</h2>
            {/* Similar to columns, return div for each task */}
            { tasks.map((task) => (
              <div key={task} className='p-3 mb-2 bg-blue-500 text-white rounded-lg shadow cursor-pointer'>
                {task}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
