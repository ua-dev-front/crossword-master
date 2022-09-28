import React from 'react';
import Tab from 'components/Tab';
import LeftArrow from 'icons/LeftArrow';
import './styles.scss';

type Props = {
  selectedTab: {
    label: string;
    icon: React.ReactNode;
  };
  secondaryTab: {
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  };
  onEditClick?: () => void;
};

export default function Tabs({
  selectedTab,
  secondaryTab,
  onEditClick,
}: Props) {
  return (
    <div className='tabs'>
      {onEditClick ? (
        <Tab
          label='Edit'
          isSelected={false}
          onClick={() => onEditClick()}
          icon={<LeftArrow />}
        />
      ) : (
        // Adds an empty div to keep the selected tab in the middle
        <div />
      )}
      {[selectedTab, secondaryTab].map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          isSelected={tab === selectedTab}
          {...(tab === secondaryTab && { onClick: secondaryTab.onClick })}
          icon={tab.icon}
        />
      ))}
    </div>
  );
}
