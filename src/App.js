import React, { useState, useLayoutEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

import useRelativeScrollPosition from "./hooks/useRelativeScrollPosition";

const App = () => {

  const [ height, setHeight ] = useState(0);

  const updateHeight = ({ currPos }) => { setHeight(currPos.y); }

  useRelativeScrollPosition({ effect: updateHeight });

  const screenRef = useRef(null);
  
  useLayoutEffect(() => {
    const { current } = screenRef;
    window.scrollTo(0, current.scrollHeight);
  }, [])

  return (
    <main className="wrap" ref={ screenRef }>
      <div className="scene">Height: { height }</div>
      <div className="meter"></div>
    </main>
  );

}

export default App;
