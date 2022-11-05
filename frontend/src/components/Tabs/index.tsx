import React, { ReactNode } from 'react';
import Tab from 'components/Tab';
import TransitionContainer from 'components/TransitionContainer';
import LeftArrow from 'icons/LeftArrow';
import Square from 'icons/Square';
import './styles.scss';

export type TabProps = {
  label: string;
  icon: ReactNode;
  alternativeLabel?: string;
  hide?: boolean;
  onClick?: () => void;
};

export type Props = {
  selectedTab?: TabProps;
  secondaryTab?: TabProps;
  onEditClick?: () => void;
};

export default function Tabs({
  selectedTab,
  secondaryTab,
  onEditClick,
}: Props) {
  return (
    <div className='tabs'>
      {[
        {
          label: 'Edit',
          onClick: onEditClick,
          icon: <LeftArrow />,
          hide: !onEditClick,
        } as TabProps,
        selectedTab, // selectedTab index in the array has a dependency with the isSelected prop of the Tab component below
        secondaryTab,
      ].map((tab, index) => (
        <TransitionContainer
          key={index}
          items={[
            {
              key: 'tab',
              content: (
                <Tab
                  label={tab?.label ?? ' '}
                  isSelected={index === 1}
                  onClick={tab?.onClick}
                  icon={tab?.icon || <Square />}
                  alternativeLabel={tab?.alternativeLabel}
                />
              ),
              display: !!tab && !tab.hide,
            },
          ]}
        />
      ))}
    </div>
  );
}
