import React from "react";
import { BlockData } from "../utils/types";

const Block: React.FC<BlockData> = ({ type }) => {
  return <div>{type}</div>;
};

export default Block;
