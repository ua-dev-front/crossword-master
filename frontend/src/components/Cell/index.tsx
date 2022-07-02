import './styles.scss';

type Props = {
  cell:
    | {
        editable: true;
        filled: boolean;
      }
    | {
        editable: false;
        content: {
          letter: string | null;
          number: number | null;
        } | null;
      };
  onClick: () => void;
};

export default function Cell({ cell, onClick }: Props) {
  return <div className='cell'>Cell</div>;
}
