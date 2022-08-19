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
  questions: Question[];
  isEditable: boolean;
  color: QuestionPanelColor;
  onChange?: (value: string, index: number) => void;
};

export default function QuestionPanel({
  questions,
  isEditable,
  color,
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
      {questions.flatMap(({ question, id }, index) => [
        index > 0 && (
          <hr className={`${className}__item-divider`} key={`divider-${id}`} />
        ),
        <article className={`${className}__item`} key={id}>
          <span
            className={`${className}__item-id ${className}__item-id_${
              id.toString().length === 1 ? 'single' : 'multiple'
            }-digit`}
          >
            {id}
          </span>
          <TextField
            className={`${className}__item-question`}
            isEditable={isEditable}
            content={question}
            onChange={(value) => onChange?.(value, index)}
          />
        </article>,
      ])}
    </section>
  );
}
