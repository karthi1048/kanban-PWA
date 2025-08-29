import './App.css'

export default function App() {
  const columns = ["To Do", "In Progress", "Done"];

  return (
    <>
      {/* <h1 className='text-3xl m-4 font-bold'>Kanban</h1> */}

      {/* Board */}
      <div className='flex h-screen bg-gray-100 p-6 gap-6'>
        {/* Iterate over columns & return div for each column */}
        { columns.map((col) => (
          // Columns
          <div key={col} className='flex-1 bg-white rounded-2xl shadow-md p-4'>
            <h2 className='text-xl font-bold mb-4'>{col}</h2>      
          </div>
        ))}
      </div>
    </>
  )
}
