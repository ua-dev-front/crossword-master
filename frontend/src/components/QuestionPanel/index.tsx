import React from 'react';
import classnames from 'classnames';
import TextField from '../TextField';
import './styles.scss';
import { Question } from '../../App';

export enum panelColor {
  Pink = 'pink',
  Yellow = 'yellow',
}

type Props = {
  color: panelColor;
  isEditable: boolean;
  questions: Question[];
  onChange?: (value: string, index: number) => void;
};

export default function QuestionPanel({
  color,
  isEditable,
  questions,
  onChange,
}: Props) {
  const classes = classnames(
    'question-panel',
    isEditable && 'question-panel_editable',
    color === panelColor.Pink && 'question-panel_pink',
    color === panelColor.Yellow && 'question-panel_yellow'
  );

  return (
    <div className={classes}>
      {questions.map((question, index) => (
        <div className='question-panel__item' key={`question-field-${index}`}>
          <span className='question-panel__item-index'>{question.id}</span>
          <TextField
            isEditable={isEditable}
            content={question.question}
            onChange={(value) => onChange?.(value, index)}
          />
        </div>
      ))}
    </div>
  );
}
