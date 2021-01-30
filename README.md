# responsive-react-window

> A library similar to react-window but responsive

[![NPM](https://img.shields.io/npm/v/responsive-react-window.svg)](https://www.npmjs.com/package/responsive-react-window) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Consider using [react-virtuoso](https://www.npmjs.com/package/react-virtuoso)
react-virtuoso is very similar to this package. It is more feature-rich and much more popular.

The whole story with responsive-react-window is rather embarrassing for me:
1) I noticed that react-window is not responsive
2) I implemented and published responsive-react-window
3) I found react-virtuoso

I'll leave this package published as a redirection to react-virtuoso for those who are searching for a responsive version of react-window.

I also leave it here for personal use (surprise, I find the syntax to be better than react-virtuoso, although I admit I'm extremely biased).
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

### [Usage examples](https://romex91.github.io/responsive-react-window/) 

## Comparison to [react-window](https://github.com/bvaughn/react-window)
|                            | react-window                 | responsive-react-window         |
| ---------------------------|:----------------------------:| -------------------------------:|
| Replaces hidden items with | CSS styles                   | placeholder HTML element        |
| Items sizes are            |specified in props            |measured automatically           |
| Items Responsiveness       |needs to be implemented by you|works out of the box             |



## License

MIT © [Romex91](https://github.com/Romex91)
