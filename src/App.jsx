import { useEffect, useState } from "react";
import { api } from "../api/axios";


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
    if (info.next !== null) {
      setCurrentPage(info.next);
    }
  }

  function previousPage(){
    if (info.prev !== null) {
      setCurrentPage(info.prev);
    }
  }
  
  return (
    <>
      <h1>Rick & Morty Characters</h1>
      {characters.map(character => (
        <div key={character.id}>
          <h1>{character.name}</h1>
        </div>
      ))}
      <button onClick={nextPage}>next</button>
      <button onClick={previousPage}>prev</button>
    </>
  )
}

export default App
