import { useState, useEffect, useRef } from "react";
import Menu from "./components/Menu";
import { COLORS } from "./colors";
import SorterVisualisation from "./components/SorterVisualisation"
import GraphVisualisation from "./components/GraphVisualisation"

function App() {

  const [type, setType] = useState(0);

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
