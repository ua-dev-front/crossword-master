import React, { ReactNode } from 'react';
import background from '../../assets/background.jpeg';
import repeatedBackground from '../../assets/repeated_background.png';
import './styles.scss';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className='layout'>
      <div className='layout__wrapper'>
        <img
          className='layout__wrapper__background'
          src={background}
          alt='background'
        />
        <div className='layout__wrapper__content'>{children}</div>
        <div className='layout__wrapper__repeated-background'>
          <div className='layout__wrapper__repeated-background__inner' />
        </div>
      </div>
    </div>
  );
}
