import { Card, Divider, Elevation, H5 } from '@blueprintjs/core';
import './styles.scss';

interface CardItemProps {
  title: string;
  description: React.ReactNode;
  actions: React.ReactNode;
}

const CardItem = (props: CardItemProps) => {
  return (
    <Card className='card-item' elevation={Elevation.TWO}>
      <H5>{props.title}</H5>
      {props.description}
      <Divider />
      <div className='card-item-actions'>{props.actions}</div>
    </Card>
  );
};

export default CardItem;
