import React from 'react';

import { ResponsiveReactWindow } from 'responsive-react-window';

import './styles.css';

function Item({ text }) {
  return (
    <div style={{ height: '95%' }} className='item'>
      {text}
    </div>
  );
}

let index = 0;
// Data
const entries = new Array(1000).fill(true).map(() => ({
  // key is mandatory.
  key: (index++).toString(),
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam,  quis nostrud exercitation ullamco laboris
    nisi ut aliquip ex ea commodo consequat.`.slice(
    0,
    Math.floor(Math.random() * (250 - 20) + 20)
  )
}));

export default function App() {
  return (
    // ResponsiveReactWindow always takes 100% of its parent's size.
    <div className='resizable'>
      <ResponsiveReactWindow
        direction='x'
        entries={entries}
        ItemComponent={Item}
      />
    </div>
  );
}
