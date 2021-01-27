import React from 'react';

import { ResponsiveReactWindow } from 'responsive-react-window';

import ResizeObserver from 'rc-resize-observer';

// A div maintaining its area by adjusting its height.
function Item(props: { initialArea: number; width: number }) {
  const [area, setArea] = React.useState(props.initialArea);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.minHeight = area / props.width + 'px';
  }, [area, props.width]);

  return (
    <div ref={ref} className='item'>
      This item adjusts its height on resize. <br />
      Area:
      <input
        type='number'
        min='10000'
        step='10000'
        value={area}
        onChange={(e) => {
          setArea(Number(e.target.value));
        }}
      ></input>
      pixels
    </div>
  );
}

export default function DynamicContent() {
  const entries: { initialArea: number; key: string }[] = [];
  for (let i = 0; i < 1000; i++) {
    entries.push({
      initialArea: Math.floor(Math.random() * (100 - 20) + 20) * 1000,
      key: i.toString()
    });
  }

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
