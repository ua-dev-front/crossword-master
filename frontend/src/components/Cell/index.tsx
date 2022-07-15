import classnames from 'classnames';
import Corner from '../../types/corner';
import './styles.scss';

type Props = {
  data:
    | {
        editable: true;
        filled: boolean;
        onEdited: (filled: boolean) => void;
      }
    | {
        editable: false;
        content: { letter: string | null; number: number | null } | null;
      };
  roundedCorners?: Corner[];
};

export default function Cell({ data, roundedCorners }: Props) {
  const { editable } = data;
  const content = !editable ? data.content : null;
  const filled: boolean = (editable && data.filled) || (!editable && !!content);

  const handleClick = () => {
    editable && data.onEdited(!filled);
  };

  const handleKeyDown = ({ code }: React.KeyboardEvent<HTMLDivElement>) => {
    if (code === 'Enter' || code === 'Space') {
      handleClick();
    }
  };

  const classes = classnames(
    'cell',
    `cell--${filled ? 'filled' : 'empty'}`,
    roundedCorners?.map((corner) => `cell--${corner}`)
  );

  return (
    <div
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {!editable && content?.letter && (
        <span className='cell__letter'>{content.letter}</span>
      )}
      {!editable && content?.number && (
        <span className='cell__number'>{content.number}</span>
      )}
    </div>
  );
}
