import React from 'react';

import { CustomReactWindow } from 'responsive-react-window';

import './styles.css';

// |CustomReactWindow| requires |ItemComponent| to be wrapped into |forwardRef|.
// It passes |ref| to |ResizeObserver| to get size of each item.
let ItemComponent = React.forwardRef(({ left, right }, ref) => {
  return (
    <tr ref={ref}>
      <td> {left} </td>
      <td> {right} </td>
    </tr>
  );
});

// You may also want to use React.memo.
// Although in this example it is unnecessary since props never change.
ItemComponent = React.memo(ItemComponent);

// This is the component that replaces hidden items below and above the current
// scroll position.
function PlaceholderComponent({ size }) {
  return (
    <tr>
      <td colSpan={2}>
        <div style={{ height: size }} />
      </td>
    </tr>
  );
}

let index = 0;
// Data
const entries = new Array(1000).fill(null).map(() => ({
  // key is mandatory.
  key: (index++).toString(),
  left: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam,  quis nostrud exercitation ullamco laboris
    nisi ut aliquip ex ea commodo consequat.`.slice(
    0,
    Math.floor(Math.random() * (250 - 20) + 20)
  ),

  right: `Lorem Ipsum is simply dummy text of the printing and typesetting
   industry. Lorem Ipsum has been the industry's standard dummy text ever 
   since the 1500s, when an unknown printer took a galley of type and scrambled 
   it to make a type specimen book. `.slice(
    0,
    Math.floor(Math.random() * (250 - 20) + 20)
  )
}));

export default function App() {
  const scrollableContainerRef = React.useRef();

  return (
    <div
      ref={scrollableContainerRef}
      style={{
        // |will-change: transform| moves <div>'s content to a
        // separate compositing level. This allows browser to calculate the layout
        // for |CustomReactWindow| separately from other parts of the page.
        //
        // This way |CustomReactWindow| won't affect performance of your site.
        // To see the effect try settings CPU throttling and scroll the container.
        willChange: 'transform',
        overflowY: 'scroll',

        // It is very important to restrict height.
        height: '80vh',

        border: '1px solid black'
      }}
    >
      <table>
        <thead>
          <tr>
            <th>This element looks different on narrow screens.</th>
            <th>Try resizing the browser window.</th>
          </tr>
        </thead>

        <tbody>
          <CustomReactWindow
            entries={entries}
            ItemComponent={ItemComponent}
            scrollableContainerRef={scrollableContainerRef}
            direction='y'
            PlaceholderComponent={PlaceholderComponent}
          />
        </tbody>
      </table>
    </div>
  );
}
