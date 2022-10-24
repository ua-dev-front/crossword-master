import React, { ReactNode } from 'react';
import Tab from 'components/Tab';
import TransitionContainer from 'components/TransitionContainer';
import LeftArrow from 'icons/LeftArrow';
import './styles.scss';

type TabProps = {
  label: string;
  icon: ReactNode;
  alternativeLabel?: string;
  hide?: boolean;
  onClick?: () => void;
};

type Props = {
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
        selectedTab,
        secondaryTab,
      ].map((tab, index) => (
        <TransitionContainer
          key={index}
          items={[
            {
              content: tab && (
                <Tab
                  label={tab.label}
                  isSelected={tab === selectedTab}
                  onClick={tab.onClick}
                  icon={tab.icon}
                  alternativeLabel={tab.alternativeLabel}
                />
              ),
              hide: !tab || !!tab.hide,
            },
            {
              // Adds an empty div to keep correct tab positions
              content: <div />,
              hide: !!tab,
            },
          ]}
        />
      ))}
    </div>
  );
}
