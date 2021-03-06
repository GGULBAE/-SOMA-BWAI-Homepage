import React, { useState } from 'react';
import styled from 'styled-components';

import NavigationBtn from './NavigationBtn.js';

export default function Navigation({ setView }) {
  const datas = ["Dashboard", "Account", "Logout"];
  const [highlight, setHighlight] = useState("Dashboard");

  function NavSetView(to) {
    setHighlight(to);
    setView(to);
  }

  return <NavigationBtns>
    {datas.map((data, index) => <NavigationBtn key={index} text={data} highlight={data===highlight} setView={NavSetView} />)}
  </NavigationBtns>
}

const NavigationBtns = styled.div`
  padding: 24px 16px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 0.875rem
`