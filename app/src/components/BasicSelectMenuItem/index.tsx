import { MenuItem } from '@blueprintjs/core';
import { ItemRendererProps } from '@blueprintjs/select';

interface BasicSelectItem {
  value: string;
  label: string;
  text: string;
}

interface BasicSelectMenuItemProps {
  item: BasicSelectItem;
  itemRendererProps: Partial<ItemRendererProps>;
}

/**
 * A functional component that renders a basic select menu item.
 *
 * @param {BasicSelectMenuItemProps} props - The properties for the BasicSelectMenuItem component.
 * @param {ItemRendererProps} props.itemRendererProps - The properties for rendering the item.
 * @param {boolean} [props.itemRendererProps.modifiers.active] - Indicates if the item is active.
 * @param {boolean} [props.itemRendererProps.modifiers.disabled] - Indicates if the item is disabled.
 * @param {function} props.itemRendererProps.handleClick - The function to call when the item is clicked.
 * @param {function} props.itemRendererProps.handleFocus - The function to call when the item is focused.
 * @param {Item} props.item - The item to be rendered.
 * @param {string} props.item.value - The value of the item.
 * @param {string} props.item.label - The label of the item.
 * @param {string} props.item.text - The text of the item.
 *
 * @returns {JSX.Element} The BasicSelectMenuItem component.
 */
const BasicSelectMenuItem = (props: BasicSelectMenuItemProps) => {
  if (props.itemRendererProps.modifiers?.matchesPredicate === false)
    return null;
  return (
    <MenuItem
      active={props.itemRendererProps.modifiers?.active}
      disabled={props.itemRendererProps.modifiers?.disabled}
      onClick={props.itemRendererProps.handleClick}
      onFocus={props.itemRendererProps.handleFocus}
      key={props.item.value}
      label={props.item.label}
      roleStructure='listoption'
      text={props.item.text}
    />
  );
};

export default BasicSelectMenuItem;

export type { BasicSelectItem, BasicSelectMenuItemProps };
