"use client";
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { BlockData, ItemTypes, Frame, sampleBlockData } from "../utils/types";
import Preview from "./Preview";
import { FaRegEdit } from "react-icons/fa";

const Workspace: React.FC = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [editingBlock, setEditingBlock] = useState<BlockData | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    drop: (item: BlockData) => {
      setBlocks((prevBlocks) => [...prevBlocks, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const mathSigns = ["=", "!=", "<", "<=", ">", ">="];

  // Update function for editing block data
  const handleUpdateBlockData = () => {
    if (editingBlock) {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === editingBlock.id ? editingBlock : block
        )
      );
      setEditingBlock(null); // Close the editor after saving changes
    }
  };

  // Change handler for form inputs
  const handleChange = (key: string, value: any, subKey?: string | number) => {
    console.log(key, value, subKey);
    setEditingBlock((prev) => {
      if (prev === null) {
        console.error("No block to edit");
        return null;
      }

      if (subKey !== undefined) {
        if (key === "logic") {
          let logic = prev[key];
          if (typeof logic !== "object" || logic === null) {
            logic = {}; // Initialize as an empty object if it's not an object
          }

          logic[subKey] = value;
          return {
            ...prev,
            [key]: logic,
          };
        } else {
          return {
            ...prev,
            [key]: {
              ...(prev[key] as object),
              [subKey]: value,
            },
          };
        }
      } else {
        return {
          ...prev,
          [key]: value,
        };
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div
        ref={drop}
        className={`min-h-[500px] p-4 border ${
          isOver ? "bg-gray-200" : "bg-white"
        }`}
      >
        {blocks.map((block, index) => (
          <div
            key={index}
            className="mb-2 text-black flex justify-between items-center"
          >
            <div>
              {block.type} - {block.name}
            </div>
            <button onClick={() => setEditingBlock(block)}>
              <FaRegEdit />
            </button>
          </div>
        ))}
      </div>
      {editingBlock && (
        <aside className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg p-4">
          <h2 className="text-lg font-semibold">Edit</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateBlockData();
            }}
          >
            {Object.entries(sampleBlockData).map(([key, value]) => {
              if (key === "id" || key === "name" || key === "type") return null;

              if (key === "position" && editingBlock.name !== "Logic") {
                if (editingBlock.type === "Background") return null;
                return (
                  <div key={crypto.randomUUID()}>
                    <label>position.x</label>
                    <input
                      type="number"
                      value={editingBlock.position?.x || 0}
                      onChange={(e) =>
                        handleChange("position", e.target.value, "x")
                      }
                      className="border p-1 rounded w-full"
                    />
                    <label>position.y</label>
                    <input
                      type="number"
                      value={editingBlock.position?.y || 0}
                      onChange={(e) =>
                        handleChange("position", e.target.value, "y")
                      }
                      className="border p-1 rounded w-full"
                    />
                  </div>
                );
              }

              if (key === "value" && editingBlock.name !== "Logic") {
                if (editingBlock.name === "Image") {
                  return (
                    <div key={crypto.randomUUID()}>
                      <label>value</label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleChange(
                            key,
                            URL.createObjectURL(e.target.files?.[0]!)
                          )
                        }
                        className="border p-1 rounded w-full"
                      />
                    </div>
                  );
                } else if (editingBlock.name === "Input") {
                  return null;
                } else {
                  return (
                    <div key={crypto.randomUUID()}>
                      <label>value</label>
                      <input
                        type={
                          editingBlock.type === "number" ? "number" : "text"
                        }
                        value={editingBlock.value as string}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    </div>
                  );
                }
              }

              if (key === "show" && editingBlock.name !== "Logic") {
                return (
                  <div key={crypto.randomUUID()}>
                    <label>show</label>
                    <input
                      type="checkbox"
                      checked={editingBlock.show}
                      onChange={(e) => handleChange(key, e.target.checked)}
                    />
                  </div>
                );
              }

              if (key === "onClick" && editingBlock.name === "Button") {
                const handleActionChange = (actionType: string) => {
                  switch (actionType) {
                    case "Goto":
                      return (
                        <>
                          <select
                            value={editingBlock.onClickAction}
                            onChange={(e) =>
                              handleChange("onClickAction", e.target.value)
                            }
                            className="border p-1 rounded w-full"
                          >
                            {frames.map((frame, index) => (
                              <option key={index} value={index}>
                                {index}
                              </option>
                            ))}
                          </select>
                        </>
                      );
                    case "Move":
                      return (
                        <div>
                          <select
                            value={editingBlock.onClickAction}
                            onChange={(e) =>
                              handleChange("onClickAction", e.target.value)
                            }
                            className="border p-1 rounded w-full"
                          >
                            <option value="up">Up</option>
                            <option value="down">Down</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                          <select
                            value={editingBlock.onClickAction}
                            onChange={(e) =>
                              handleChange("logicBlock", e.target.value)
                            }
                            className="border p-1 rounded w-full"
                          >
                            <option value="1" disabled>
                              Select an option
                            </option>
                            {blocks.map((block, index) => (
                              <option key={index} value={block.id}>
                                {block.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    // case "Submit":
                    //   return (
                    //     <div>
                    //       <input
                    //         type="text"
                    //         value={editingBlock.onClickAction}
                    //         onChange={(e) =>
                    //           handleChange(
                    //             "onClickAction",
                    //             `window.alert("${e.target.value}")`
                    //           )
                    //         }
                    //         className="border p-1 rounded w-full"
                    //       />
                    //     </div>
                    //   );
                    default:
                      console.log("Action not recognized");
                  }
                };

                return (
                  <div key={crypto.randomUUID()}>
                    <label>onClick</label>
                    <div>{handleActionChange(editingBlock.type)}</div>
                  </div>
                );
              }

              if (key === "logic" && editingBlock.name === "Logic") {
                return (
                  <div key={crypto.randomUUID()}>
                    <p>If</p>
                    <br />
                    <select
                      className="border p-1 rounded"
                      value={editingBlock.logic ? editingBlock.logic[0] : ""}
                      onChange={(e) => {
                        handleChange(key, e.target.value, 0);
                      }} // TODO: Fix this
                    >
                      {blocks.map((block) => (
                        <option
                          key={block.id}
                          value={block.id}
                          disabled={block.name === "Logic"}
                        >
                          {block.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border p-1 rounded mx-2"
                      value={editingBlock.logic ? editingBlock.logic![1] : ""}
                      onChange={(e) => handleChange(key, e.target.value, 1)}
                    >
                      {mathSigns.map((sign, index) => (
                        <option key={index} value={sign}>
                          {sign}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border p-1 rounded"
                      value={editingBlock.logic ? editingBlock.logic![2] : ""}
                      onChange={(e) => {
                        console.log(editingBlock.logic);
                        handleChange(key, e.target.value, 2);
                      }}
                    >
                      {blocks.map((block) => (
                        <option
                          key={block.id}
                          value={block.id}
                          disabled={block.name === "Logic"}
                        >
                          {block.name}
                        </option>
                      ))}
                    </select>

                    <div className="mt-2">
                      {editingBlock.type === "Goto" ? (
                        <div>
                          Go to frame
                          <select
                            className="border p-1 rounded ml-2"
                            value={
                              editingBlock.logic ? editingBlock.logic![3] : ""
                            }
                            onChange={(e) =>
                              handleChange(
                                key,
                                `{setFrame(parseInt(${e.target.value}))}`,
                                3
                              )
                            }
                          >
                            {frames.map((frame, index) => (
                              <option key={index} value={index}>
                                {index}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          Alert
                          <input
                            type="text"
                            //   value={editingBlock.logic ? editingBlock.logic![3] : ""}
                            onChange={(e) =>
                              handleChange(
                                key,
                                `window.alert(${e.target.value})`,
                                3
                              )
                            }
                            className="border p-1 rounded ml-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}

            <button
              type="submit"
              className="mt-4 bg-[#1495b3] hover:bg-[#1495b3] text-white font-bold py-1 px-2 rounded"
            >
              Save
            </button>
          </form>
        </aside>
      )}
      <Preview code={blocks} />
    </div>
  );
};

export default Workspace;
