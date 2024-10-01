import { useEffect, useState } from "react";
import { api } from "../api/axios";
import CharacterCard from "./components/CharacterCard";


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
    <>
      <header>
        <nav>
          <h1 className="text-6xl text-center mb-40">Rick & Morty Characters</h1>
        </nav>
      </header>
      <div>
        <input onChange={(event) => setSearchQuery(event.target.value)} type="text" placeholder='Search by name...' />
        {searchQuery && filteredCharacters.length !== 1 ? (
          <p>{filteredCharacters.length} results for: {searchQuery} </p>
        ): searchQuery && (
          <p>{filteredCharacters.length} result for: {searchQuery} </p>
        )}
      </div>

      {info.prev && (
        <button onClick={previousPage}>prev</button>
      )}

      {info.next && (
        <button onClick={nextPage}>next</button>
      )}

      {filteredCharacters.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {filteredCharacters.map(character => (
            <CharacterCard 
              key={character.id}
              characterImage={character.image}
              characterName={character.name}
              characterStatus={character.status}
              characterSpecies={character.species}
              characterOrigin={character.origin.name}
              characterLocation={character.location.name}
            />
          ))}
        </div>
        ) : (
          <p>No characters matching {searchQuery} were found on this page</p>
        )
      }
    </>
  )
}

export default App
