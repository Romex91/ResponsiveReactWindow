import React from 'react';

import { ResponsiveReactWindow } from 'responsive-react-window';

// A div maintaining its area by adjusting its height.
function Item(props: { initialArea: number }) {
  const [area, setArea] = React.useState(props.initialArea);
  const ref = React.useRef<HTMLDivElement>(null);

  const onSizeChange = React.useCallback(() => {
    if (!ref.current) return;
    ref.current.style.minHeight = area / ref.current.clientWidth + 'px';
  }, [area]);

  React.useEffect(onSizeChange, [onSizeChange]);
  React.useEffect(() => {
    window.addEventListener('resize', onSizeChange);
    return () => {
      window.removeEventListener('resize', onSizeChange);
    };
  });

  return (
    <div ref={ref} className='item'>
      This item adjusts its height on winow resize. <br />
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

const App = () => {
  const entries: { initialArea: number; key: string }[] = [];
  for (let i = 0; i < 1000; i++) {
    entries.push({
      initialArea: Math.floor(Math.random() * (100 - 20) + 20) * 5000,
      key: i.toString()
    });
  }

  return (
    <ResponsiveReactWindow
      direction='y'
      width='100vw'
      height='100vh'
      entries={entries}
      ItemComponent={Item}
    />
  );
};

export default App;
