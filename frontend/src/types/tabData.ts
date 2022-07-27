type tabData = 
  | {
    isSelected: true;
  }
  | {
    isSelected: false;
    onClick: () => void;
  };

export default tabData;
