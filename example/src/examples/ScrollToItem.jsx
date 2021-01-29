import React from 'react';

import { ResponsiveReactWindow } from 'responsive-react-window';

import './styles.css';

function Item({ text }) {
  return <div className='item'>{text}</div>;
}

let index = 0;
const entries = new Array(1000).fill(null).map(() => ({
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
  const [scrollToIndex, setScrollToIndex] = React.useState(undefined);

  const onScrollToClicked = (index) => () => {
    setScrollToIndex(index);
  };

  return (
    <div>
      <button onClick={onScrollToClicked(0)}>SCROLL TO 0</button>
      <button onClick={onScrollToClicked(100)}>SCROLL TO 100</button>
      <button onClick={onScrollToClicked(200)}>SCROLL TO 200</button>
      <div className='resizable'>
        <ResponsiveReactWindow
          scrollToIndex={scrollToIndex}
          onScrolledToIndex={() => {
            // This is mandatory to avoid lock of scrollbar.
            setScrollToIndex(undefined);
          }}
          entries={entries}
          ItemComponent={Item}
        />
      </div>
    </div>
  );
}
