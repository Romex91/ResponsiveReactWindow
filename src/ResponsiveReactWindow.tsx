import React from 'react';
import { CustomReactWindow } from './CustomReactWindow';

interface ResponsiveReactWindowProps<ItemProps> {
  entries: ItemProps[];
  defaultItemHeight?: number;
  ItemComponent: React.ComponentType<ItemProps>;
  direction?: 'x' | 'y';
  width?: string;
  height?: string;
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

function PlaceholderY(props: { size: number }) {
  return <div style={{ height: props.size }}> </div>;
}
function PlaceholderX(props: { size: number }) {
  return <div style={{ minWidth: props.size, height: '100%' }}> </div>;
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
      style={
        props.direction === 'x'
          ? {
              width: props.width ?? '100%',
              height: props.height ?? '100%',
              willChange: 'transform',
              overflowX: 'scroll',
              display: 'flex'
            }
          : {
              width: props.width ?? '100%',
              height: props.height ?? '100%',
              willChange: 'transform',
              overflowY: 'scroll'
            }
      }
    >
      <CustomReactWindow
        entries={props.entries}
        ItemComponent={memoizedComponent}
        PlaceholderComponent={
          props.direction === 'x' ? PlaceholderX : PlaceholderY
        }
        scrollableContainerRef={scrollableContainerRef}
        defaultItemSize={props.defaultItemHeight}
        direction={props.direction ?? 'y'}
      />
    </div>
  );
}
