"use client";
import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes, BlockData } from "../utils/types";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { CiText } from "react-icons/ci";
import { GoNumber } from "react-icons/go";

type Operator = "==" | "!=" | ">" | "<" | ">=" | "<=";
type Condition = {
  logic?: "if" | "else";
  input?: number;
  operator?: Operator;
  value?: string;
  targetIndex?: number;
};
type Action = {
  type: string;
  targetIndex?: number;
  condition?: Condition;
};
type ButtonType = "Goto" | "Submit";
type Button = {
  text: string;
  type: ButtonType;
  action: Action;
};
type Image = {
  type: "text" | "file";
  value: string;
};

type Frame = {
  title?: string;
  image: Image;
  buttons: Button[];
  inputs: number;
};

const Toolbox: React.FC = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isAdding, setIsAdding] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditFrame = (index: number) => {
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleSaveFrame = (frame: Frame) => {
    if (editingIndex !== null) {
      const updatedFrames = [...frames];
      updatedFrames[editingIndex] = frame;
      setFrames(updatedFrames);
      setEditingIndex(null);
    } else {
      setFrames([...frames, frame]);
    }
    setIsAdding(false);
  };

  return (
    <div className="bg-white m-10 px-5 w-1/2">
      <div className="text-2xl font-bold py-3">Build Game</div>
      {frames.map((frame, index) => {
        return (
          <div
            className="border-2 border-black rounded-md my-3 p-2"
            key={index}
          >
            <RenderFrame
              title={frame.title}
              image={frame.image}
              buttons={frame.buttons}
              inputs={frame.inputs}
            />
            <button
              className="border border-black rounded-md p-1 mt-3"
              onClick={() => handleEditFrame(index)}
            >
              Edit Frame
            </button>
          </div>
        );
      })}
      {isAdding ? (
        <AddFrame
          frameTitles={frames.map((frame) => frame.title || "")}
          onSaveFrame={handleSaveFrame}
          editingFrame={
            editingIndex !== null ? frames[editingIndex] : undefined
          }
        />
      ) : (
        <button
          className="font-bold py-1 px-3 border-2 rounded-md"
          onClick={() => setIsAdding(true)}
        >
          Add Frame
        </button>
      )}
    </div>
  );
};

const RenderFrame = ({ title, image, buttons, inputs }: Frame) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {image.type === "text" ? (
        <p className="text-gray-700">{image.value}</p>
      ) : (
        <div className="flex justify-center">
          <img
            src={image.value}
            alt={title || ""}
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}
      <div className="my-4">
        {Array.from({ length: inputs }, (_, i) => (
          <div key={i} className="mb-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        {buttons.map((button, index) => {
          return (
            <button
              key={index}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {button.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AddFrame = ({
  frameTitles,
  onSaveFrame,
  editingFrame,
}: {
  frameTitles: string[];
  onSaveFrame: (frame: Frame) => void;
  editingFrame?: Frame;
}) => {
  const [frameTitle, setFrameTitle] = useState(editingFrame?.title || "");
  const [image, setImage] = useState<Image>(
    editingFrame?.image || { type: "text", value: "" }
  );
  const [inputs, setInputs] = useState(editingFrame?.inputs || 0);
  const [buttons, setButtons] = useState<Button[]>(editingFrame?.buttons || []);
  const [actionType, setActionType] = useState<ButtonType>("Goto");
  const [buttonText, setButtonText] = useState("");
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [condition, setCondition] = useState<Condition | undefined>();

  useEffect(() => {
    if (editingFrame) {
      setFrameTitle(editingFrame.title || "");
      setImage(editingFrame.image);
      setInputs(editingFrame.inputs);
      setButtons(editingFrame.buttons);
    }
  }, [editingFrame]);

  const handleAddButton = () => {
    if (
      buttonText.trim() !== "" &&
      (actionType === "Goto" ? targetIndex !== 0 : condition !== undefined)
    ) {
      const newButton: Button = {
        text: buttonText,
        type: actionType,
        action:
          actionType === "Goto"
            ? { type: "goto", targetIndex: targetIndex }
            : { type: "submit", condition },
      };
      setButtons([...buttons, newButton]);
      setButtonText("");
      setActionType("Goto");
      setTargetIndex(0); // Reset targetIndex
      setCondition(undefined); // Reset condition
    }
  };

  const handleRemoveButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const handleUpdateButtonAction = (index: number, action: Action) => {
    const updatedButtons = buttons.map((button, i) => {
      if (i === index) {
        return { ...button, action };
      }
      return button;
    });
    setButtons(updatedButtons);
  };

  const handleSave = () => {
    const newFrame: Frame = {
      title: frameTitle,
      image,
      inputs,
      buttons,
    };
    onSaveFrame(newFrame);
    setFrameTitle("");
    setImage({ type: "text", value: "" });
    setInputs(0);
    setButtons([]);
  };

  return (
    <div>
      <div>
        <div className="my-3">
          <label>Frame Title</label> <br />
          <input
            className="border border-black rounded-md p-1"
            type="text"
            placeholder="Frame Title"
            value={frameTitle}
            onChange={(e) => setFrameTitle(e.target.value)}
          />
        </div>
        <div className="my-3">
          <label>Image</label> <br />
          <div className="flex">
            <select
              className="border border-black rounded-md p-1 mr-3"
              value={image.type}
              onChange={(e) =>
                setImage({ type: e.target.value as "text" | "file", value: "" })
              }
            >
              <option value="text">Text</option>
              <option value="file">File</option>
            </select>
            {image.type === "text" ? (
              <input
                className="border border-black rounded-md p-1"
                type="text"
                value={image.value}
                onChange={(e) => setImage({ ...image, value: e.target.value })}
              />
            ) : (
              <input
                type="file"
                onChange={(e) =>
                  setImage({ ...image, value: e.target.files?.[0].name || "" })
                }
              />
            )}
          </div>
        </div>
        <div className="my-3">
          <label>Inputs</label> <br />
          <input
            className="border border-black rounded-md p-1"
            type="number"
            min={0}
            max={4}
            value={inputs}
            onChange={(e) => setInputs(parseInt(e.target.value))}
          />
        </div>
        <div className="my-3">
          <label>Buttons</label> <br />
          <div>
            {buttons.map((button, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <button>{button.text}</button>
                  <button
                    className="border border-black rounded-md p-1"
                    onClick={() => handleRemoveButton(index)}
                  >
                    Remove Button
                  </button>
                </div>
              );
            })}
          </div>
          <div className="my-4 p-2 border border-gray-300 rounded-lg">
            <input
              type="text"
              placeholder="Button Text"
              className="border border-gray-300 rounded-md p-1 my-2"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
            />
            <select
              onChange={(e) => setActionType(e.target.value as ButtonType)}
              className="border border-gray-300 rounded-md p-1 m-2"
            >
              <option value="">Select Action</option>
              <option value="Goto">Goto</option>
              <option value="Submit">Submit</option>
            </select>
            {actionType === "Goto" && (
              <select
                className="border border-gray-300 rounded-md p-1 my-2"
                value={targetIndex}
                onChange={(e) => setTargetIndex(parseInt(e.target.value) + 1)}
              >
                {frameTitles.map((title, index) => (
                  <option key={index} value={index}>
                    {title}
                  </option>
                ))}
              </select>
            )}
            {actionType === "Submit" && (
              <div className="m-2">
                if
                <select
                  onChange={(e) =>
                    setCondition({
                      ...condition,
                      logic: "if",
                      input: parseInt(e.target.value),
                    })
                  }
                  className="border border-black rounded-md p-1 bg-gray-50 mx-2"
                >
                  {Array.from({ length: inputs }, (_, i) => i).map((i) => {
                    return <option key={i}>Input {i + 1}</option>;
                  })}
                </select>
                <select
                  onChange={(e) =>
                    setCondition({
                      ...condition,
                      operator: e.target.value as Operator,
                    })
                  }
                  className="border border-black rounded-md p-1 bg-gray-50"
                >
                  <option value="==">==</option>
                  <option value="!=">!=</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                </select>
                <input
                  type="text"
                  value={condition?.value}
                  onChange={(e) =>
                    setCondition({ ...condition, value: e.target.value })
                  }
                  className="border border-gray-300 rounded-md p-1 mx-2 bg-white"
                />
                <div>
                  Goto{" "}
                  <select
                    className="border border-gray-300 rounded-md p-1 my-2 bg-gray-50"
                    value={targetIndex}
                    onChange={(e) => {
                      setCondition({
                        ...condition,
                        targetIndex: parseInt(e.target.value),
                      });
                    }}
                  >
                    {frameTitles.map((title, index) => (
                      <option key={index} value={index}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <button
            className="border border-black rounded-md p-1"
            onClick={handleAddButton}
          >
            Add Button
          </button>
        </div>
      </div>
      <button onClick={handleSave}>Save Frame</button>
    </div>
  );
};

export default Toolbox;
