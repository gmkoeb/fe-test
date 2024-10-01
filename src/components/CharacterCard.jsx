import { useEffect, useState } from "react"
import { api } from "../../api/axios"

export default function CharacterCard(props){
  const [originDetails, setOriginDetails] = useState({})
  const [originOpen, setOriginOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [originCharacters, setOriginCharacters] = useState([])
  const [locationDetails, setLocationDetails] = useState({})
  const [locationCharacters, setLocationCharacters] = useState([])

  useEffect(() => {
    if (originOpen) {
      getOriginDetails()
    }

    if (locationOpen){
      getLocationDetails()
    }
  }, [originOpen, locationOpen])

  useEffect(() => {
    if (originOpen) {
      getOriginCharacters()
    }

    if (locationOpen) {
      getLocationCharacters()
    }
  }, [originDetails, locationDetails])

  async function getOriginDetails(){
    const result = await api.get(props.characterOrigin.url)
    setOriginDetails(result.data)
  }

  async function getLocationDetails(){
    const result = await api.get(props.characterLocation.url)
    setLocationDetails(result.data)
  }

  async function getOriginCharacters(){
    const responses = await Promise.all(originDetails.residents.map(url => api.get(url)));
    const data = responses.map(response => response.data);
    setOriginCharacters(data)
  }
  
  async function getLocationCharacters(){
    const responses = await Promise.all(locationDetails.residents.map(url => api.get(url)));
    const data = responses.map(response => response.data);
    setLocationCharacters(data)
  }
  
  function openOrigin(){
    setLocationOpen(false)
    setOriginOpen(true)
  }

  function openLocation(){
    setOriginOpen(false)
    setLocationOpen(true)
  }

  return(
    <div className="flex border w-[550px]" key={props.id}>
      <div className="w-48">
        <img className="h-full" src={`${props.characterImage}`} alt="" />
      </div>
      <div className="flex flex-col gap-3 ml-4 mt-2">
        <div>
          <h1>{props.characterName}</h1>
          <h3>{props.characterStatus}-{props.characterSpecies}</h3>
        </div>
        <div>
          <h4>Origin:</h4>
          <h3 onClick={() => openOrigin()}>{props.characterOrigin.name}</h3>
          {originOpen && (
           <div key={originDetails.id} className="inset-0 text-center fixed bg-slate-600 text-white w-1/4 h-1/2 overflow-y-scroll mx-auto mt-40">
            <div>
              <h1>Origin Details</h1>
              <button onClick={() => setOriginOpen(false)}>x</button>
            </div>
            <div>
              <h2>Name</h2>
              <p>{originDetails.name}</p>
              <h2>Dimension</h2>
              <p>{originDetails.dimension}</p>
              <div>
                <h3>Residents</h3>
                {originCharacters.map(character => (
                  <div key={character.id}>
                    {character.name}
                  </div>
                ))}
              </div>
            </div> 
            </div>
          )}
        </div>
        <div>
          <h4>Last known location: </h4>
          <h3 onClick={() => openLocation()}>{props.characterLocation.name}</h3>
          {locationOpen && (
            <div key={locationDetails.id} className="inset-0 text-center fixed bg-slate-600 text-white w-1/4 h-1/2 overflow-y-scroll mx-auto">
              <div>
                <h1>Location Details</h1>
                <button onClick={() => setLocationOpen(false)}>x</button>
              </div>
              <div>
                <h2>Name</h2>
                <p>{locationDetails.name}</p>
                <h2>Dimension</h2>
                <p>{locationDetails.name}</p>
                <div>
                  <h3>Residents</h3>
                  {locationCharacters.map(character => (
                    <div key={character.id}>
                      {character.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
