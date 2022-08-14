import React from 'react';
import classnames from 'classnames';
import TextField from '../TextField';
import './styles.scss';

export enum QuestionPanelColor {
  Pink = 'pink',
  Yellow = 'yellow',
}

export type Question = {
  id: number;
  question: string;
};

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
    isEditable && `${className}_editable`,
    `${className}_${color}`
  );

  return (
    <section className={classes}>
      {questions.map(({ question, id }, index) => (
        <article className={`${className}__item`} key={id}>
          <span
            className={`${className}__item-id ${
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
          {index < questions.length - 1 && (
            <hr className={`${className}__item-divider`} />
          )}
        </article>
      ))}
    </section>
  );
}
