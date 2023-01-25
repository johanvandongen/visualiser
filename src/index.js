import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
export { default as SideMenuGeneric } from "./components/SideMenuComp/SideMenuGeneric";
export { default as  PlayPause } from "./components/SideMenuComp/PlayPause";
export { default as AlgSelection } from "./components/SideMenuComp/AlgSelection";
export { default as GraphGenButtons } from "./components/SideMenuComp/GraphGenButtons";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // strict mode renders components twice (on dev but not production) in order to detect any problems with your code and warn you about them
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
