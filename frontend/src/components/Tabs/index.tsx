import React from 'react';
import Tab from 'components/Tab';
import LeftArrow from 'icons/LeftArrow';
import './styles.scss';

type Props = {
  selectedTab: {
    label: string;
    icon: React.ReactNode;
  };
  secondTab: {
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  };
  onEditClick?: () => void;
};

export default function Tabs({ selectedTab, secondTab, onEditClick }: Props) {
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
      <Tab
        label={selectedTab.label}
        isSelected={true}
        icon={selectedTab.icon}
      />
      <Tab
        label={secondTab.label}
        isSelected={false}
        onClick={secondTab.onClick}
        icon={secondTab.icon}
      />
    </div>
  );
}
