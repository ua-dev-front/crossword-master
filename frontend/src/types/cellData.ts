type CellData =
  | {
      editable: true;
      filled: boolean;
      onEdited: () => void;
    }
  | {
      editable: false;
      content: { letter: string | null; number: number | null } | null;
    };

export default CellData;
