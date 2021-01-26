import React from 'react';
import { CustomReactWindow } from './CustomReactWindow';

interface ResponsiveReactWindowProps<ItemProps> {
  entries: ItemProps[];
  defaultItemHeight?: number;
  ItemComponent: React.ComponentType<ItemProps>;
}

function withRefContainer<ItemProps>(
  ItemComponent: React.ComponentType<ItemProps>
) {
  return React.forwardRef<HTMLDivElement, ItemProps>((props, ref) => (
    <div ref={ref}>
      <ItemComponent {...props} />
    </div>
  ));
}

function Placeholder(props: { height: number }) {
  return <div style={{ height: props.height }}> </div>;
}

export function ResponsiveReactWindow<
  ItemProps extends { key: string; focused?: boolean }
>(props: ResponsiveReactWindowProps<ItemProps>) {
  const scrollableContainerRef = React.useRef(null);
  return (
    <div
      ref={scrollableContainerRef}
      style={{
        height: '100%',
        maxHeight: '100vh',
        width: '100%',
        overflowY: 'scroll',
        willChange: 'transform'
      }}
    >
      <CustomReactWindow
        entries={props.entries}
        ItemComponent={withRefContainer<ItemProps>(props.ItemComponent)}
        PlaceholderComponent={Placeholder}
        scrollableContainerRef={scrollableContainerRef}
        defaultItemHeight={props.defaultItemHeight}
      />
    </div>
  );
}
