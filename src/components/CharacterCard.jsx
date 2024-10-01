import { useEffect, useState } from "react"
import { api } from "../../api/axios"
import { colorBasedOnStatus } from "../lib/colorBasedOnStatus"
import { Circle, X } from "lucide-react"
import { fillBasedOnStatus } from "../lib/fillBasedOnStatus"

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
    <div className="flex border w-[550px] bg-gray-800 rounded-lg border-black" key={props.id}>
      <div className="w-48">
        <img className="h-full rounded-l-lg" src={`${props.characterImage}`} alt="" />
      </div>
      <div className="flex flex-col gap-3 ml-4 mt-2">
        <div>
          <h1 className="text-2xl text-emerald-300 font-bold">{props.characterName}</h1>
          <div className="flex gap-1 items-center">
            <Circle width={12} fill={fillBasedOnStatus(props.characterStatus)}/>
            <h3 className={`${colorBasedOnStatus(props.characterStatus)} text-md`}>{props.characterStatus}-{props.characterSpecies}</h3>
          </div>
        </div>
        <div>
          <h4 className="text-lg text-slate-500 font-bold">Origin:</h4>
          <h3 className="text-md text-slate-200 underline hover:cursor-pointer hover:opacity-70 duration-300" onClick={() => openOrigin()}>{props.characterOrigin.name}</h3>
          {originOpen && (
           <div key={originDetails.id} className="inset-0 text-center fixed bg-slate-800 text-white w-1/2 overflow-y-scroll h-1/2 mx-auto mt-40 rounded-lg border border-black">
            <div className="flex justify-between ml-5 mt-5">
              <button onClick={() => setOriginOpen(false)}><X stroke="red"></X></button>
            </div>
            <h1 className="text-2xl font-bold text-emerald-300"><span className="underline">{props.characterName}</span> Origin Details</h1>
            <div>
              <h2 className="text-xl font-bold text-slate-500">Name</h2>
              <p>{originDetails.name}</p>
              <h2 className="text-xl text-slate-500 font-bold">Dimension</h2>
              <p>{originDetails.dimension}</p>
              <div>
                <h3 className="text-xl text-slate-500 mt-5 font-bold">Residents</h3>
                <div className="grid grid-cols-4 justify-center gap-5 p-5">
                  {originCharacters.map(character => (
                    <div className="flex flex-col items-center border rounded-lg mx-2 p-2 bg-slate-900" key={character.id}>
                      <img className="rounded-full" width={52} src={character.image} alt="" />
                      <p className="font-bold text-emerald-300">{character.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div> 
            </div>
          )}
        </div>
        <div>
          <h4 className="text-lg text-slate-500 font-bold">Last known location: </h4>
          <h3 className="text-md text-slate-200 underline hover:cursor-pointer hover:opacity-70 duration-300 mb-2" onClick={() => openLocation()}>{props.characterLocation.name}</h3>
          {locationOpen && (
            <div key={locationDetails.id} className="inset-0 text-center fixed bg-slate-800 text-white w-1/2 overflow-y-scroll h-1/2 mx-auto mt-40 rounded-lg border border-black">
              <div className="flex justify-between ml-5 mt-5">
                <button onClick={() => setLocationOpen(false)}><X stroke="red"></X></button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-300"><span className="underline">{props.characterName}</span> Location Details</h1>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-500">Name</h2>
                <p>{locationDetails.name}</p>
                <h2 className="text-xl text-slate-500 font-bold">Dimension</h2>
                <p>{locationDetails.name}</p>
                <div>
                  <h3 className="text-xl text-slate-500 font-bold">Residents</h3>
                  <div className="grid grid-cols-4 justify-center gap-5 p-5">        
                    {locationCharacters.map(character => (
                      <div className="flex flex-col items-center border rounded-lg mx-2 p-2 bg-slate-900" key={character.id}>
                        <img className="rounded-full" width={52} src={character.image} alt="" />
                        <p className="font-bold text-emerald-300">{character.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
