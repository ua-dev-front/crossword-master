import classnames from 'classnames';
import './styles.scss';

type Props = {
  isFilled: boolean;
  content?: string;
};

export default function Square(props: Props) {
  const { isFilled, content } = props;

  const classes = classnames(
    'icon',
    'icon__square',
    isFilled && 'icon__square_filled'
  );

  return <span className={classes}>{content && content}</span>;
}
