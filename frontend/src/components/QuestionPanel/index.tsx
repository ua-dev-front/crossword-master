import React, { useId } from 'react';
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

export type Props = {
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
  const panelId = useId();

  const className = 'question-panel';
  const classes = classnames(
    className,
    isEditable && `${className}_editable`,
    `${className}_${color}`
  );

  return (
    <section className={classes}>
      {questions.flatMap(({ question, id }, index) => {
        const itemIdClassName = `${className}__item-id`;
        const idClasses = classnames(
          itemIdClassName,
          `${itemIdClassName}_${
            id.toString().length === 1 ? 'single' : 'multiple'
          }-digit`
        );
        const inputId = `${panelId}-${id}`;

        return [
          index > 0 && (
            <hr
              key={`divider-${id}`}
              className={`${className}__item-divider`}
            />
          ),
          <article key={id} className={`${className}__item`}>
            {isEditable ? (
              <label className={idClasses} htmlFor={inputId}>
                {id}
              </label>
            ) : (
              <span className={idClasses}>{id}</span>
            )}
            <TextField
              className={`${className}__item-question`}
              inputId={inputId}
              isEditable={isEditable}
              content={question}
              onChange={(value) => onChange?.(value, index)}
            />
          </article>,
        ];
      })}
    </section>
  );
}
