import React, { useCallback, useMemo } from 'react';
import { Mode, State } from 'store';
import Button from 'components/Button';
import GridWrapper from 'components/GridWrapper';
import Label, { LabelSize } from 'components/Label';
import { Mode as GridMode } from 'components/Grid';
import Tabs from 'components/Tabs';
import Square from 'icons/Square';
import './styles.scss';

export type Props = {
  mode: Mode.Draw | Mode.Erase;
  grid: State['grid'];
  onModeChange: () => void;
  onCellChange: (row: number, column: number) => void;
};

export default function DrawingOrErasingView({
  mode,
  grid,
  onModeChange,
  onCellChange,
}: Props) {
  const getTabByModeAndIsSelected = useCallback(
    (currentMode: Mode.Draw | Mode.Erase, isSelected: boolean) => {
      const addGerundToVerb = (verb: string) => {
        if (verb.endsWith('ing')) {
          return verb;
        }

        if (verb.endsWith('e')) {
          return verb.slice(0, verb.length - 1) + 'ing';
        }

        if (verb.endsWith('ie')) {
          return verb.slice(0, verb.length - 2) + 'ying';
        }

        return verb + 'ing';
      };

      const normalizeLabel = (label: string) => {
        const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
        return isSelected
          ? addGerundToVerb(capitalizedLabel)
          : capitalizedLabel;
      };

      const normalizedDrawLabel = normalizeLabel(Mode.Draw);
      const normalizedEraseLabel = normalizeLabel(Mode.Erase);

      switch (currentMode) {
        case Mode.Draw:
          return {
            label: normalizedDrawLabel,
            alternativeLabel: normalizedEraseLabel,
            icon: <Square isFilled={false} />,
          };
        case Mode.Erase:
          return {
            label: normalizedEraseLabel,
            alternativeLabel: normalizedDrawLabel,
            icon: <Square isFilled={true} />,
          };
      }
    },
    []
  );

  const booleanGrid = useMemo(
    () => grid.map((row) => row.map((cell) => !!cell)),
    [grid]
  );

  const isGridEmpty = useMemo(() => {
    return booleanGrid.every((row) => row.every((cell) => !cell));
  }, [booleanGrid]);

  return (
    <>
      <GridWrapper
        gridProps={{
          matrix: booleanGrid,
          mode: mode === Mode.Draw ? GridMode.Draw : GridMode.Erase,
          onChange: (row, column) => onCellChange(row, column),
        }}
      >
        <Tabs
          selectedTab={getTabByModeAndIsSelected(mode, true)}
          secondaryTab={{
            ...getTabByModeAndIsSelected(
              mode === Mode.Draw ? Mode.Erase : Mode.Draw,
              false
            ),
            onClick: () => onModeChange(),
          }}
        />
      </GridWrapper>
      {isGridEmpty ? (
        <div className='center'>
          <Label
            content='Let’s draw some squares first!'
            size={LabelSize.Large}
          />
        </div>
      ) : (
        <div className='center option-buttons'>
          <Button
            label='Generate questions'
            onClick={() => console.log('test')}
          />
          <Button
            label='Enter questions & solve'
            onClick={() => console.log('test')}
          />
        </div>
      )}
    </>
  );
}
