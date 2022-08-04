import classnames from 'classnames';
import './styles.scss';

type Props = {
  isFilled: boolean;
  content?: string;
};

export default function Square({ isFilled, content }: Props) {
  const classes = classnames(
    'icon',
    'icon__square',
    isFilled && 'icon__square_filled'
  );

  return <span className={classes}>{content}</span>;
}
