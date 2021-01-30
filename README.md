# responsive-react-window

> A library similar to react-window but responsive

[![NPM](https://img.shields.io/npm/v/responsive-react-window.svg)](https://www.npmjs.com/package/responsive-react-window) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save responsive-react-window
```

## Usage

Suppose you need to render a long list of items.

Long story short, instead of:
```jsx
function LongList(props) {
  return (
    <div>
      {props.entries.map((entry) => (
        <Item {...entry} />
      ))}
    </div>
  );
}
```
use this:
```jsx
import { ResponsiveReactWindow } from 'responsive-react-window';
function LongList(props) {
  return (
    <ResponsiveReactWindow entries={props.entries} ItemComponent={Item} />
  );
}
```

[Usage examples](https://romex91.github.io/responsive-react-window/) 

## Comparison to [react-window](https://github.com/bvaughn/react-window)
|                            | react-window                 | responsive-react-window         |
| ---------------------------|:----------------------------:| -------------------------------:|
| Replaces hidden items with | CSS styles                   | placeholder HTML element        |
| Items sizes are            |specified in props            |measured automatically           |
| Responsiveness             |needs to be implemented by you|works out of the box             |



## License

MIT © [Romex91](https://github.com/Romex91)
