import { useEffect, useState } from "react";
import { api } from "../api/axios";
import CharacterCard from "./components/CharacterCard";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";


function App() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [currentPage, setCurrentPage] = useState('/character/?page=1');
  const [searchQuery, setSearchQuery] = useState('');

  async function getCharacters(){
    const response = await api.get(currentPage);
    setCharacters(response.data.results);
    setFilteredCharacters(response.data.results);
    setInfo(response.data.info);
  }
  
  useEffect(() => {
    getCharacters()
  }, [currentPage]);

  useEffect(() => {
    setFilteredCharacters(() => characters.filter((character => character.name.toLowerCase().includes(searchQuery.toLowerCase()))))
  }, [searchQuery, characters])

  function nextPage(){
    setCurrentPage(info.next);
  }

  function previousPage(){
    setCurrentPage(info.prev);
  }
  
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
          {searchQuery && filteredCharacters.length !== 1 ? (
            <p className="mb-2">{filteredCharacters.length} results for: {searchQuery} </p>
          ): searchQuery && (
            <p className="mb-2">{filteredCharacters.length} result for: {searchQuery} </p>
          )}
        </div>
      </div>
      <div className="flex flex-col text-white">
        <div className="flex mb-4 gap-32 text-white justify-center">
          {info.prev && (
            <button onClick={previousPage} className="cursor-pointer w-32 border rounded-lg hover:bg-slate-700 duration-300">Previous Page</button>
          )}
          {info.next && (
            <button onClick={nextPage} className="cursor-pointer w-32 border rounded-lg hover:bg-slate-700 duration-300">Next Page</button>
          )}
        </div>
        {filteredCharacters.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {filteredCharacters.map(character => (
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
