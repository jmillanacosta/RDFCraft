import { MenuDivider } from '@blueprintjs/core';
import { ItemListRendererProps } from '@blueprintjs/select';
import React from 'react';

type GroupedSelectRendererProps<T> = {
  listProps: ItemListRendererProps<T>;
  initialContent?: JSX.Element;
  noResults?: JSX.Element;
  getGroup: (item: T) => string;
  createFirst?: boolean;
};

const GroupedSelectRenderer = <T,>({
  listProps,
  initialContent,
  noResults,
  getGroup,
  createFirst = true,
}: GroupedSelectRendererProps<T>) => {
  const createItemView = listProps.renderCreateItem();
  const menuContent = _GroupedMenuContent(
    listProps,
    initialContent,
    noResults,
    getGroup,
  );

  if (menuContent === null && createItemView === null) {
    return null;
  }

  return (
    <div
      style={{
        listStyleType: 'none',
      }}
    >
      {createFirst && createItemView}
      {menuContent}
      {!createFirst && createItemView}
    </div>
  );
};

const _GroupedMenuContent = <T,>(
  props: ItemListRendererProps<T>,
  initialContent: JSX.Element | undefined,
  noResults: JSX.Element | undefined,
  getGroup: (item: T) => string,
) => {
  if (props.filteredItems.length === 0 && initialContent) {
    return initialContent;
  }

  const groupedItems = props.filteredItems.reduce<
    Array<{ group: string; index: number; items: T[]; key: number }>
  >((acc, item, index) => {
    const group = getGroup(item);
    const groupIndex = acc.findIndex(g => g.group === group);
    if (groupIndex === -1) {
      acc.push({ group, index, items: [item], key: index });
    } else {
      acc[groupIndex].items.push(item);
    }
    return acc;
  }, []);

  const menuContent = groupedItems.map(groupedItem => (
    <React.Fragment key={groupedItem.key}>
      <MenuDivider title={groupedItem.group} />
      {groupedItem.items.map((item, index) =>
        props.renderItem(item, groupedItem.index + index),
      )}
    </React.Fragment>
  ));

  return props.filteredItems.length === 0 ? noResults : menuContent;
};

export default GroupedSelectRenderer;
