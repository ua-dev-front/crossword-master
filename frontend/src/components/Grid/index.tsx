import Mode from '../../types/mode';

import './styles.scss';

type Props =
  | {
      mode: Mode.Draw | Mode.Erase;
      matrix: boolean[][];
      onChange: (row: number, column: number) => void;
    }
  | {
      mode: Mode.Puzzle;
      matrix: ({
        number: number | null;
      } | null)[][];
    }
  | {
      mode: Mode.Answer;
      matrix: ({
        letter: string;
        number: number | null;
      } | null)[][];
    };

export default function Grid({ mode, matrix }: Props) {
  return <div className='grid'>Grid</div>;
}
