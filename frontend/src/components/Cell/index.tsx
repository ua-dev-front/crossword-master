import './styles.scss';

type Props = {
  data:
    | {
        editable: true;
        filled: boolean;
      }
    | {
        editable: false;
        content:
          | { letter: string; number: number | null }
          | { number: number | null }
          | null;
      };
  onEdited: (filled: boolean) => void;
};

export default function Cell({ data, onEdited }: Props) {
  return <div className='cell'>Cell</div>;
}
