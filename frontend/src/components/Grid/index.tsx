import Mode from '../../types/mode';

import './styles.scss';

type Props =
  | {
      matrix: Boolean[][];
      mode: Mode.Draw | Mode.Erase;
      onChange: (row: number, column: number) => void;
    }
  | {
      matrix:
        | {
            number: number | null;
          }
        | null[][];
      mode: Mode.Puzzle;
    }
  | {
      matrix:
        | {
            letter: string;
            number: number | null;
          }
        | null[][];
      mode: Mode.Answer;
    };

export default function Grid({ matrix, mode }: Props) {
  return <div className='grid'>Grid</div>;
}
