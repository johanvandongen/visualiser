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

  const [type, setType] = useState(1);

  // Styles ---
  const topMenuStyle = {
    height:"10vh", 
    width:"100%", 
    backgroundColor: COLORS.color2,
    position:"relative", 
    padding:"1rem 1rem"
  }

  const types = {
    0: {name: "Sorter", comp: <SorterVisualisation/>},
    1: {name: "Network Graph", comp: <GraphVisualisation/>},
    2: {name: "Hello world", comp: <HelloWorld/>}
  }

  const changeType = (event) => {
    console.log("changed to: ", event.target.value)
    setType(event.target.value)
  }

  return (
    <>
    
    <div style={topMenuStyle}>
      <TopMenu changeType={changeType} types={types} currentType={type}/>
    </div>
    {types[type].comp}
    </>
  )
}

export default App;
