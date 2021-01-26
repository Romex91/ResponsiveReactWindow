import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

interface VirtualizedItemProps<ItemProps> {
  onSizeChanged(key: string, heigh: number): void;
  itemProps: ItemProps;
  ItemComponent: ReturnType<typeof React.forwardRef>;
  direction: 'x' | 'y';
}

class VirtualizedItem<
  ItemProps extends { key: string }
> extends React.Component<VirtualizedItemProps<ItemProps>> {
  private _ref = React.createRef<HTMLElement>();
  _resizeObserver?: ResizeObserver;

  private onSizeChanged = () => {
    if (this._ref.current) {
      this.props.onSizeChanged(
        this.props.itemProps.key,
        this.props.direction === 'y'
          ? this._ref.current.offsetHeight
          : this._ref.current.offsetWidth
      );
    }
  };

  componentDidMount() {
    if (this._ref.current) {
      this._resizeObserver = new ResizeObserver(this.onSizeChanged);
      this._resizeObserver.observe(this._ref.current);
    }
  }

  componentWillUnmount() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
  }

  render() {
    const { ItemComponent, itemProps } = this.props;
    return <ItemComponent ref={this._ref} {...itemProps} />;
  }
}

interface VirtualizedListProps<ItemProps> {
  entries: ItemProps[];
  defaultItemSize?: number;
  scrollableContainerRef: React.RefObject<HTMLElement>;
  ItemComponent: ReturnType<typeof React.forwardRef>;
  PlaceholderComponent: React.ComponentType<{ size: number }>;
  direction: 'x' | 'y';
}

export function CustomReactWindow<
  ItemProps extends { key: string; focused?: boolean }
>(props: VirtualizedListProps<ItemProps>): JSX.Element {
  const [parentOffset, setParentOffset] = React.useState(0);
  const parentOffsetMeasuringRef = React.useRef<HTMLDivElement>(null);

  const [scroll, setScroll] = React.useState(0);
  const [windowSize, setWindowSize] = React.useState(
    props.direction === 'y' ? window.innerHeight : window.innerWidth
  );

  const [realSizesMap, setRealSizesMap] = React.useState(new Map());

  const onSizeChanged = React.useCallback((key: string, size: number) => {
    setRealSizesMap((oldMap) => {
      const newMap = new Map(oldMap);

      newMap.set(key, size);
      return newMap;
    });
  }, []);

  const keys = new Set(props.entries.map((x) => x.key));
  const keysToDelete: string[] = [];
  realSizesMap.forEach((_value, key) => {
    if (!keys.has(key)) {
      keysToDelete.push(key);
    }
  });
  if (keysToDelete.length > 0) {
    setRealSizesMap((oldMap) => {
      const newMap = new Map(oldMap);
      keysToDelete.forEach((key) => {
        if (oldMap.has(key)) newMap.delete(key);
      });
      return newMap;
    });
  }

  React.useEffect(() => {
    const onResizeOrScroll = () => {
      if (props.scrollableContainerRef.current)
        setScroll(
          props.direction === 'y'
            ? props.scrollableContainerRef.current.scrollTop
            : props.scrollableContainerRef.current.scrollLeft
        );
      setWindowSize(
        props.direction === 'y' ? window.innerHeight : window.innerWidth
      );

      if (parentOffsetMeasuringRef.current) {
        setParentOffset(parentOffsetMeasuringRef.current.offsetTop);
      }
    };
    if (props.scrollableContainerRef.current)
      props.scrollableContainerRef.current.onscroll = onResizeOrScroll;
    window.addEventListener('resize', onResizeOrScroll);
    return () => {
      window.removeEventListener('resize', onResizeOrScroll);
    };
  }, [props.scrollableContainerRef]);

  const visibleEntries: JSX.Element[] = [];
  let currentSize = 0;
  let placeholderTop = 0;
  let placeholderBottom = 0;

  for (const entry of props.entries) {
    let entrySize = props.defaultItemSize ?? 80;
    if (realSizesMap.has(entry.key)) {
      entrySize = realSizesMap.get(entry.key);
    }

    if (currentSize + entrySize < scroll - parentOffset - windowSize) {
      if (entry.focused && !!props.scrollableContainerRef.current) {
        props.scrollableContainerRef.current.scrollTop = currentSize;
      }

      placeholderTop += entrySize;
    } else if (currentSize < scroll - parentOffset + 2 * windowSize) {
      visibleEntries.push(
        <VirtualizedItem
          key={entry.key}
          onSizeChanged={onSizeChanged}
          itemProps={entry}
          direction={props.direction}
          ItemComponent={props.ItemComponent}
        />
      );
    } else {
      if (entry.focused && props.scrollableContainerRef.current) {
        props.scrollableContainerRef.current.scrollTop = currentSize;
      }

      placeholderBottom += entrySize;
    }
    currentSize += entrySize;
  }
  if (placeholderTop !== 0) {
    visibleEntries.unshift(
      <props.PlaceholderComponent size={placeholderTop} key='placeholderTop' />
    );
  }

  if (placeholderBottom !== 0) {
    visibleEntries.push(
      <props.PlaceholderComponent
        size={placeholderBottom}
        key='placeholderBottom'
      />
    );
  }

  return (
    <React.Fragment>
      <div ref={parentOffsetMeasuringRef} />
      {visibleEntries}
    </React.Fragment>
  );
}
