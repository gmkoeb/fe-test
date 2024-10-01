export default function CharacterCard(props){
  return(
    <div className="flex border w-96" key={props.id}>
      <div className="w-40" >
        <img src={`${props.characterImage}`} alt="" />
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <h1>{props.characterName}</h1>
          <h3>{props.characterStatus}-{props.characterSpecies}</h3>
        </div>
        <div>
          <h4>Origin:</h4>
          <h3>{props.characterOrigin}</h3>
        </div>
        <div>
          <h4>Last known location: </h4>
          <h3>{props.characterLocation}</h3>
        </div>
      </div>
    </div>
  )
}