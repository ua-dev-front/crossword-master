import React, { ReactNode } from 'react';
import './styles.scss';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className='layout'>
      <div className='layout__wrapper'>
        <div className='layout__wrapper__background' />
        <div className='layout__wrapper__content'>{children}</div>
        <div className='layout__wrapper__repeated-background'>
          <div className='layout__wrapper__repeated-background__mask'></div>
          <div className='layout__wrapper__repeated-background__background'></div>
        </div>
      </div>
    </div>
  );
}
