import React from 'react';

import { ResponsiveReactWindow } from 'responsive-react-window';
import ResizeObserver from 'rc-resize-observer';

import './styles.css';

// A div maintaining its area by adjusting its height.
function Item({ initialArea, width }) {
  const [area, setArea] = React.useState(initialArea);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.minHeight = area / width + 'px';
  }, [area, width]);

  const grow = () => {
    setArea(area + 10000);
  };
  const shrink = () => {
    setArea(area - 10000);
  };

  return (
    <div ref={ref} className='item'>
      Area: {area} pixels
      <div>
        <button onClick={grow}>GROW</button>
        <button onClick={shrink}>SHRINK</button>
      </div>
    </div>
  );
}

let index = 0;
// Data
const entries = new Array(1000).fill(null).map(() => ({
  // key is mandatory.
  key: (index++).toString(),
  initialArea: Math.floor(Math.random() * (100 - 20) + 20) * 1000
}));

export default function App() {
  const [width, setWidth] = React.useState(200);

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setWidth(width);
      }}
    >
      <div className='resizable'>
        <ResponsiveReactWindow
          direction='y'
          entries={entries.map((entry) => ({ width, ...entry }))}
          ItemComponent={Item}
        />
      </div>
    </ResizeObserver>
  );
}
