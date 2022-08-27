import React from 'react';
import classnames from 'classnames';
import TitleLabel from 'components/TitleLabel';
import './styles.scss';

type Props = {
  label: string;
  isLoading: boolean; // need to make an animation, shows the loader when true
};

export default function Loader({ label, isLoading }: Props) {
  const className = 'loader';
  const classes = classnames(className, !isLoading && `${className}_hidden`);

  return (
    <div className={classes}>
      <div className={`${className}__label`}>{label}</div>
    </div>
  );
}
