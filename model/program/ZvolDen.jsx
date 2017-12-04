function ZvolDen(props) {
  return (
    <div>
      <button onClick = {() => props.zvolTentoDen(3)} className = {props.zvolenyDen === 3 ? "den-zvoleny" : "den-nezvoleny"}>Středa</button>
      <button onClick = {() => props.zvolTentoDen(4)} className = {props.zvolenyDen === 4 ? "den-zvoleny" : "den-nezvoleny"}>Čtvrtek</button>
      <button onClick = {() => props.zvolTentoDen(5)} className = {props.zvolenyDen === 5 ? "den-zvoleny" : "den-nezvoleny"}>Pátek</button>
      <button onClick = {() => props.zvolTentoDen(6)} className = {props.zvolenyDen === 6 ? "den-zvoleny" : "den-nezvoleny"}>Sobota</button>
      <button onClick = {() => props.zvolTentoDen(0)} className = {props.zvolenyDen === 0 ? "den-zvoleny" : "den-nezvoleny"}>Neděle</button>
    </div>
  )
}
