import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import useScrollPosition from "./hooks/useScrollPosition";

const App = () => {

  const [ height, setHeight ] = useState(0);

  const updateHeight = ({ currPos }) => {
    setHeight(currPos.y);
  }

  useScrollPosition({
    effect: updateHeight
  });

  return (
    <div style={{ height: "20000px"}}>
      <p>I'm a hook!</p>
      <p>Current height: { height }</p>
    </div>
  );

}

export default App;
