import { useEffect, useState } from "react";
import { api } from "../api/axios";
import CharacterCard from "./components/CharacterCard";


function App() {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({})
  const [currentPage, setCurrentPage] = useState('/character/?page=1');

  async function getCharacters(){
    const response = await api.get(currentPage);
    setCharacters(response.data.results);
    setInfo(response.data.info);
  }
  
  useEffect(() => {
    getCharacters()
  }, [currentPage]);

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
      {info.prev && (
        <button onClick={previousPage}>prev</button>
      )}

      {info.next && (
        <button onClick={nextPage}>next</button>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        {characters.map(character => (
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
    </>
  )
}

export default App
