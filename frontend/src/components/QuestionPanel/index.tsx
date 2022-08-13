import React from 'react';
import classnames from 'classnames';
import TextField from '../TextField';
import './styles.scss';
import { Question } from '../../App';

export enum QuestionPanelColor {
  Pink = 'pink',
  Yellow = 'yellow',
}

type Props = {
  color: QuestionPanelColor;
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
  const className = 'question-panel';

  const classes = classnames(
    className,
    isEditable && 'question-panel_editable',
    `${className}_${color}`
  );

  return (
    <div className={classes}>
      {questions.map(({ question, id }, index) => (
        <div className='question-panel__item' key={id}>
          <span
            className={`question-panel__item-id ${
              id.toString().length === 1 ? 'single' : 'multiple'
            }-digit`}
          >
            {id}
          </span>
          <TextField
            isEditable={isEditable}
            content={question}
            onChange={(value) => onChange?.(value, index)}
          />
        </div>
      ))}
    </div>
  );
}
