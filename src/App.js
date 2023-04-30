import { useState, useEffect, useRef } from "react";
import TopMenu from "./components/Menu/TopMenu";
import { COLORS } from "./utils/colors";
import SorterVisualisation from "./components/SorterVisualisation"
import GraphVisualisation from "./components/GraphVisualisation"
import HelloWorld from "./components/HelloWorld"

export const sideMenuStyle = {
  height:"70vh", 
  width:"20%", 
  backgroundColor: COLORS.color3,
  position:"relative",
  padding:"1rem 1rem"
}

export const visStyle = {
  width:"80%", 
  height: "70vh",
  backgroundColor: COLORS.menuColor,
  position:"relative",
  padding:"1rem 1rem",
}

function App() {

  const [type, setType] = useState("Sorter");

  // Styles ---
  const topMenuStyle = {
    height:"10vh", 
    width:"100%", 
    backgroundColor: COLORS.color2,
    position:"relative", 
    padding:"1rem 1rem"
  }

  const types = {
    "Sorter" : <SorterVisualisation/>,
    "Network Graph" : <GraphVisualisation/>
  }

  const changeType = (event) => {
    setType(event.target.value)
  }

  return (
    <>
    
    <div style={topMenuStyle}>
      <TopMenu changeType={changeType} types={types} currentType={type}/>
    </div>
    {types[type]}
    </>
  )
}

export default App;
