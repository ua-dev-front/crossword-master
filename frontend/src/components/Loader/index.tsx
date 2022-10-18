import React from 'react';
import classnames from 'classnames';
import TitleLabel, { TitleLabelSize } from 'components/TitleLabel';
import './styles.scss';

export type Props = {
  label: string;
  display: boolean; // is needed to display the animation, shows the loader when true
};

export default function Loader({ label, display }: Props) {
  const className = 'loader';

  return (
    <div className={classnames(className, !display && `${className}_hidden`)}>
      <TitleLabel content={label} size={TitleLabelSize.Small} tag='p' />
    </div>
  );
}
