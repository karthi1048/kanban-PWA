import { useEffect, useState } from "react"

export default function SearchTaskBar({ searchQuery, setSearchQuery }) {

    const [localQuery, setLocalQuery] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(localQuery);           // so here localQuery takes searchQuery place
        }, 300);                                  // debounce delay: 300ms

        return () => {
            clearTimeout(handler);                // cleanup if user types again, before 300ms
        }
    }, [localQuery, setSearchQuery]);

    // localQuery updates immediately while typing & get the value
    // setSearchQuery updates only after 300ms of no typing.

    return (
        <div className='relative mb-4'>
            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>🔎</span>
            <input 
                type="text"
                placeholder='Search Tasks...'
                value={ localQuery }
                onChange={ (e) => setLocalQuery(e.target.value) }
                className={`border pl-10 pr-3 py-2 rounded-lg shadow-sm focus:outline-none w-full
                            focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}/>
            { searchQuery && (
            <button 
                onClick={ () => {
                    setLocalQuery("");
                    setSearchQuery("");
                }}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                ❌
            </button>
            ) }
        </div>
    )
}