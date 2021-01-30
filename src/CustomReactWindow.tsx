import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import PropTypes from 'prop-types';

interface VirtualizedItemProps<ItemProps> {
  onSizeChanged(key: string, heigh: number): void;
  onParentOffset?(offset: number): void;
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
    const element = this._ref.current;
    if (element) {
      this.props.onSizeChanged(
        this.props.itemProps.key,
        this.props.direction === 'y'
          ? element.offsetHeight
          : element.offsetWidth
      );
      if (this.props.onParentOffset) {
        this.props.onParentOffset(
          this.props.direction === 'y' ? element.offsetTop : element.offsetLeft
        );
      }
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

  scrollToIndex?: number;
  onScrolledToIndex?: (this: void) => void;
}

CustomReactWindow.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultItemSize: PropTypes.number,
  scrollableContainerRef: PropTypes.object.isRequired,
  ItemComponent: PropTypes.elementType.isRequired,
  PlaceholderComponent: PropTypes.elementType.isRequired,
  direction: PropTypes.oneOf(['x', 'y']).isRequired,

  scrollToIndex: PropTypes.number,
  onScrolledToIndex: PropTypes.func
};

export function CustomReactWindow<ItemProps extends { key: string }>(
  props: VirtualizedListProps<ItemProps>
): JSX.Element {
  const [parentOffset, setParentOffset] = React.useState(0);

  const [scrollToAttempts, setScrollToAttempts] = React.useState(0);
  React.useEffect(() => {
    setScrollToAttempts(0);
  }, [props.scrollToIndex]);

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
      const container = props.scrollableContainerRef.current;
      if (container) {
        setScroll(
          props.direction === 'y' ? container.scrollTop : container.scrollLeft
        );
        setWindowSize(
          props.direction === 'y'
            ? container.offsetHeight
            : container.offsetWidth
        );
      }
    };
    if (props.scrollableContainerRef.current)
      props.scrollableContainerRef.current.onscroll = onResizeOrScroll;
    else console.error('scrollableContainerRef is not set');

    window.addEventListener('resize', onResizeOrScroll);
    return () => {
      window.removeEventListener('resize', onResizeOrScroll);
    };
  }, [props.scrollableContainerRef]);

  const visibleEntries: JSX.Element[] = [];
  let currentSize = 0;
  let placeholderTop = 0;
  let placeholderBottom = 0;

  let index = -1;
  let scrollToSize: number | null = null;
  for (const entry of props.entries) {
    index++;
    let entrySize = props.defaultItemSize ?? 80;
    if (realSizesMap.has(entry.key)) {
      entrySize = realSizesMap.get(entry.key);
    }

    if (index === props.scrollToIndex) {
      scrollToSize = currentSize + parentOffset;
    }

    if (currentSize + entrySize < scroll - parentOffset - windowSize) {
      placeholderTop += entrySize;
    } else if (currentSize < scroll - parentOffset + 2 * windowSize) {
      visibleEntries.push(
        <VirtualizedItem
          key={entry.key}
          onSizeChanged={onSizeChanged}
          itemProps={entry}
          direction={props.direction}
          ItemComponent={props.ItemComponent}
          onParentOffset={index === 0 ? setParentOffset : undefined}
        />
      );
    } else {
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

  // |props.scrollToIndex| handling.
  // It is often impossible to predict size of hidden elements. That's why scrolling to an
  // index of a hidden element is inaccurate.
  // To compensate for this we make 5 scrolling attempts until calling |onScrolledToIndex|.
  // It may be a dirty workaround but it works.
  React.useEffect(() => {
    if (scrollToAttempts === 5) {
      if (props.onScrolledToIndex === undefined) {
        throw new Error('scrollToIndex must be used with onScrolledToIndex');
      }
      props.onScrolledToIndex();
    } else {
      const container = props.scrollableContainerRef.current;
      if (scrollToSize != null && container) {
        container.scrollTop = scrollToSize;
        setTimeout(() => {
          setScrollToAttempts(scrollToAttempts + 1);
        }, 300);
      }
    }
  }, [scrollToAttempts, props.scrollToIndex]);

  return <React.Fragment>{visibleEntries}</React.Fragment>;
}
