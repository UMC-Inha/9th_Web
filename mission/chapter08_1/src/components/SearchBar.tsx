import { useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce';
import { LpData } from '../types/lps';

const SearchBar = ({ onSearch } : { onSearch : (data : LpData[]) => void }) => {
    const [query, setQuery] = useState('');
    const debounceQuery = useDebounce(query, 1000);
    

    useEffect(() => {
        onSearch(debounceQuery);
    }, [debounceQuery])

    return (
        <div className=''>
            <div className='flex flex-1 justify-center items-center border border-gray-800 rounded-full w-100 h-10 p-5'>
                <input 
                type="text"
                placeholder='검색어를 입력하세요'
                className='w-100 h-10 focus:outline-none text-center'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
                <p className='text-[22px] text-gray-500 transition rotate-320'> ⚲ </p>
            </div>
        </div>
    )
}

export default SearchBar
