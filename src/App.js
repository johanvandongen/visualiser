import { useState, useEffect, useRef } from "react";
import Menu from "./components/Menu";
import { COLORS } from "./colors";
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

  const components = {
    0: <SorterVisualisation/>,
    1: <GraphVisualisation/>,
    2: <HelloWorld/>,
  }

  const changeType = (event) => {
    console.log("changed to: ", event.target.value)
    setType(event.target.value)
  }

  return (
    <>
    
    <div style={topMenuStyle}>
      <Menu changeType={changeType}/>
    </div>
    {components[type]}
    </>
  )
}

export default App;
