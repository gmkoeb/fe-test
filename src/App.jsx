import { useEffect, useState } from "react";
import { api } from "../api/axios";
import CharacterCard from "./components/CharacterCard";

function App() {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [currentPage, setCurrentPage] = useState('/character/?page=1');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null)
  async function getCharacters(url){
    try {
      const response = await api.get(url);
      setCharacters(response.data.results);
      setInfo(response.data.info);
    } catch (error) {
      setError(error)
    }
  }
  
  function handlePagination(page){
    if (searchQuery !== '' && page === 'first') {
      setCurrentPage(`/character/?page=1&name=${searchQuery}`)
    } else if (searchQuery === '' && page === 'first') {
      setCurrentPage('/character/?page=1')
    } else {
      setCurrentPage(page)
    }
  }

  useEffect(() => {
      getCharacters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const url = searchQuery ? `/character/?name=${searchQuery}&page=1` : '/character/?page=1';
    setCurrentPage(url);
    setError('')
  }, [searchQuery]);

  return (
    <div className="mb-20 mx-auto">
      <header>
        <nav>
          <h1 className="text-6xl text-center mb-40 mt-20 text-emerald-300 font-bold">Rick & Morty Characters</h1>
        </nav>
      </header>
      <div className="flex flex-col items-center">
        <input className="w-96 px-2 py-1 rounded-lg mb-4" onChange={(event) => setSearchQuery(event.target.value)} type="text" placeholder='Search by name...' />
        <div className="text-slate-200 text-lg">
          {searchQuery && info.count !== 1 && !error ? (
            <p className="mb-2">{info.count} results for: {searchQuery} </p>
          ): searchQuery && !error && (
            <p className="mb-2">{info.count} result for: {searchQuery} </p>
          )}
        </div>
      </div>
      <div className="flex flex-col text-white">
        <div className="flex mb-4 text-white gap-16 justify-center">
          {info.prev && !error && (
            <div className="gap-16 flex">
              <button onClick={() => handlePagination(info.prev)} className="cursor-pointer w-32 border rounded-lg hover:bg-slate-700 duration-300">Previous Page</button>
              <button onClick={() => handlePagination('first')} className="cursor-pointer w-32 border rounded-lg hover:bg-slate-700 duration-300">First Page</button>
            </div>
          )}
          {info.next && !error && (
            <button onClick={() => handlePagination(info.next)} className="cursor-pointer w-32 border rounded-lg hover:bg-slate-700 duration-300">Next Page</button>
          )}
        </div>
        {!error ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {characters.map(character => (
              <CharacterCard
                key={character.id}
                characterImage={character.image}
                characterName={character.name}
                characterStatus={character.status}
                characterSpecies={character.species}
                characterOrigin={character.origin}
                characterLocation={character.location}
              />
            ))}
          </div>
        ) : (
          <p className="text-xl font-bold text-slate-200 text-center">No characters matching <span className="underline text-emerald-300">{searchQuery}</span> were found on this page</p>
        )}
      </div>
    </div>
  )
}

export default App
