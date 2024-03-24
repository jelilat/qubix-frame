export const ItemTypes = {
  BLOCK: "block",
};

export interface Block {
  type: string;
}

export type BlockData = {
  id: string;
  name: string;
  type: string;
  value?: string | number;
  position?: {
    x: number;
    y: number;
  };
  show?: boolean;
  onClick?: (event: MouseEvent) => void; // logic, math, pos change, var change
  [key: string]: any;
};

export const sampleBlockData: BlockData = {
  id: "1",
  name: "Example Block",
  type: "input",
  value: "Some value",
  position: {
    x: 100,
    y: 200,
  },
  show: true,
  onClick: (event: MouseEvent) => {
    window.alert("Clicked!");
  },
  logic: {},
};

export type Frame = {
  blocks: BlockData[];
};
