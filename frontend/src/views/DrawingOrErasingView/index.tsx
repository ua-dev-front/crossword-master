import React, { useMemo } from 'react';
import classnames from 'classnames';
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
  onGenerateQuestions: () => void;
  onSwitchToEnteringQuestions: () => void;
  loaderLabel: string | null;
};

export default function DrawingOrErasingView({
  mode,
  grid,
  onModeChange,
  onCellChange,
  onGenerateQuestions,
  onSwitchToEnteringQuestions,
  loaderLabel,
}: Props) {
  const getTabByModeAndIsSelected = (
    currentMode: Mode.Draw | Mode.Erase,
    isSelected: boolean,
  ) => {
    const getLabel = (labelMode: Mode.Draw | Mode.Erase) => {
      const labelByModeAndIsSelected = {
        [Mode.Draw]: {
          regular: 'Draw',
          selected: 'Drawing',
        },
        [Mode.Erase]: {
          regular: 'Erase',
          selected: 'Erasing',
        },
      };

      return labelByModeAndIsSelected[labelMode][
        isSelected ? 'selected' : 'regular'
      ];
    };

    const label = getLabel(currentMode);
    const alternativeLabel = getLabel(
      currentMode === Mode.Draw ? Mode.Erase : Mode.Draw,
    );

    return {
      label,
      alternativeLabel,
      icon: <Square isFilled={currentMode === Mode.Erase} />,
    };
  };

  const booleanGrid = useMemo(
    () => grid.map((row) => row.map((cell) => !!cell)),
    [grid],
  );

  const isGridEmpty = useMemo(() => {
    return booleanGrid.every((row) => row.every((cell) => !cell));
  }, [booleanGrid]);

  const className = 'drawing-or-erasing-view';

  return (
    <div className={className}>
      <GridWrapper
        gridProps={{
          matrix: booleanGrid,
          mode: mode === Mode.Draw ? GridMode.Draw : GridMode.Erase,
          onChange: (row, column) => onCellChange(row, column),
        }}
        loaderLabel={loaderLabel}
      >
        <Tabs
          selectedTab={getTabByModeAndIsSelected(mode, true)}
          secondaryTab={{
            ...getTabByModeAndIsSelected(
              mode === Mode.Draw ? Mode.Erase : Mode.Draw,
              false,
            ),
            onClick: () => onModeChange(),
          }}
        />
      </GridWrapper>
      <div className={`${className}__buttons-wrapper`}>
        <div
          className={classnames(
            `${className}__buttons-wrapper-item`,
            !isGridEmpty && `${className}__buttons-wrapper-item_hidden`,
          )}
        >
          <Label
            content='Let’s draw some squares first!'
            size={LabelSize.Large}
          />
        </div>
        <div
          className={classnames(
            `${className}__buttons-wrapper-item`,
            isGridEmpty && `${className}__buttons-wrapper-item_hidden`,
            `${className}__buttons`,
          )}
        >
          <Button
            label='Generate questions'
            onClick={() => onGenerateQuestions()}
          />
          <Button
            label='Enter questions & solve'
            onClick={() => onSwitchToEnteringQuestions()}
          />
        </div>
      </div>
    </div>
  );
}
