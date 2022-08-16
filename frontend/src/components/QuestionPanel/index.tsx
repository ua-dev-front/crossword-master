import React, { Fragment } from 'react';
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
        <Fragment key={id}>
          {index !== 0 && <hr className={`${className}__item-divider`} />}
          <article className={`${className}__item`}>
            <TextField
              className={`${className}__item-id ${
                id.toString().length === 1 ? 'single' : 'multiple'
              }-digit`}
              content={id.toString()}
            />
            <TextField
              className={`${className}__item-question`}
              isEditable={isEditable}
              content={question}
              onChange={(value) => onChange?.(value, index)}
            />
          </article>
        </Fragment>
      ))}
    </section>
  );
}
