import React from "react";
import { BlockData } from "../utils/types";

interface PreviewProps {
  code: BlockData[];
}

const Preview: React.FC<PreviewProps> = ({ code }) => {
  // Find a background block, if any
  const backgroundBlock = code.find((block) => block.type === "background");

  const renderBlockContent = (block: BlockData) => {
    if (!block.show) return null;
    // Exclude the background from being rendered like other blocks
    if (block.type === "Background") return null;

    const style: React.CSSProperties = block.position
      ? {
          position: "absolute",
          left: `${block.position.x}px`, // Ensures 'left' is a string with 'px'
          top: `${block.position.y}px`, // Ensures 'top' is a string with 'px'
        }
      : {};

    switch (block.type) {
      case "text":
      case "number":
        if (block.name === "Input") {
          return (
            <input
              type={block.type}
              value={block.value as any}
              style={style}
              className="border p-1 rounded"
            />
          );
        } else {
          return <div style={style}>{block.value as any}</div>;
        }
      case "Move":
      case "Goto":
      case "Submit":
        console.log(block);
        return (
          <button
            style={style}
            className="px-2 py-1 bg-blue-500 text-white rounded"
            onClick={() => eval(`window.alert('Correct')`)}
          >
            {block.value as string}
          </button>
        );
      case "Image":
        return (
          <img
            src={block.value as string}
            alt={block.name}
            style={{ ...style, maxWidth: "100px", maxHeight: "100px" }}
          />
        );
      // No default case for specific handling
    }
  };

  return (
    <div
      className="mt-4 relative"
      style={{
        margin: "10 auto",
        padding: "10px",
        width: "100%",
        height: "500px",
        border: "2px solid #000",
        position: "relative",
        backgroundImage: backgroundBlock
          ? `url(${backgroundBlock.value as string})`
          : "",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="mt-2 flex flex-wrap justify-center items-center">
        {code.map((block, index) => (
          <React.Fragment key={index}>
            {renderBlockContent(block)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Preview;
