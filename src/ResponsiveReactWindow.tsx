import React from 'react';
import { CustomReactWindow } from './CustomReactWindow';

interface ResponsiveReactWindowProps<ItemProps> {
  entries: ItemProps[];
  defaultItemHeight?: number;
  ItemComponent: React.ComponentType<ItemProps>;
  scrollToIndex?: number;
  onScrolledToIndex?: (this: void) => void;
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

function Placeholder(props: { size: number }) {
  return <div style={{ height: props.size }}> </div>;
}

export function ResponsiveReactWindow<
  ItemProps extends { key: string; focused?: boolean }
>(props: ResponsiveReactWindowProps<ItemProps>) {
  const scrollableContainerRef = React.useRef<HTMLDivElement>(null);

  // TODO: write memoization tests
  const memoizedComponent = React.useMemo(
    () => React.memo(withRefContainer<ItemProps>(props.ItemComponent)),
    [props.ItemComponent]
  );

  return (
    <div
      ref={scrollableContainerRef}
      style={{
        width: '100%',
        height: '100%',
        willChange: 'transform',
        overflowY: 'scroll'
      }}
    >
      <CustomReactWindow
        entries={props.entries}
        ItemComponent={memoizedComponent}
        PlaceholderComponent={Placeholder}
        scrollableContainerRef={scrollableContainerRef}
        defaultItemSize={props.defaultItemHeight}
        direction='y'
        scrollToIndex={props.scrollToIndex}
        onScrolledToIndex={props.onScrolledToIndex}
      />
    </div>
  );
}
