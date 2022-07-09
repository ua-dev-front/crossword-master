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
  corner?: Corner;
};

export default function Cell({ data, corner }: Props) {
  const { editable } = data;
  const content = !editable ? data.content : null;
  const filled = (editable && data.filled) || (!editable && content);

  const classes = [
    'cell',
    `cell--${filled ? 'filled' : 'empty'}`,
    corner && `cell--${corner}`,
  ];

  return (
    <div
      className={classes.join(' ')}
      onClick={() => editable && data.onEdited(!filled)}
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
