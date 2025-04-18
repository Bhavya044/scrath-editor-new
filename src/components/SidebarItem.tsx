/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Icon from "./Icon";
import BlockWrapper from "./BlockWrapper";
import { getTextIcon } from "../utils/common";
import { drag } from "../utils/dragAndDrop";
import { getBlockColor } from "../utils/constants";

interface BlockData {
  text: string;
  icon?: string;
  input?: string | string[];
  category: string;
  defaultValue?: string | string[];
  description?: string;
  min?: number | number[];
  max?: number | number[];
}

interface SidebarItemProps {
  title: string;
  data: BlockData[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ title, data }) => {
  const [inputValues, setInputValues] = useState<Record<number, string[]>>({});

  const handleInputChange = (
    blockIndex: number,
    inputIndex: number,
    value: string
  ) => {
    setInputValues((prev) => {
      const newValues = { ...prev };
      if (!newValues[blockIndex]) {
        newValues[blockIndex] = [];
      }
      newValues[blockIndex][inputIndex] = value;
      return newValues;
    });
  };

  const renderInput = (
    block: BlockData,
    blockIndex: number,
    inputIndex: number
  ) => {
    const defaultValue = Array.isArray(block.defaultValue)
      ? block.defaultValue[inputIndex]
      : block.defaultValue;

    const value = inputValues[blockIndex]?.[inputIndex] || defaultValue;

    let inputStyle =
      "w-14 px-2 py-1 mx-2 text-center bg-gray-200 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 " +
      "transition-all duration-200 ease-in-out";

    if (block.text.includes("Move")) {
      inputStyle += " bg-blue-100 text-blue-700";
    } else if (block.text.includes("Turn")) {
      inputStyle += " bg-green-100 text-green-700";
    } else if (block.text.includes("Go to")) {
      inputStyle += " bg-purple-100 text-purple-700";
    }

    return (
      <div className="relative group inline-block">
        <input
          type="number"
          value={value}
          onChange={(e) =>
            handleInputChange(blockIndex, inputIndex, e.target.value)
          }
          className={inputStyle}
          min={Array.isArray(block.min) ? block.min[inputIndex] : block.min}
          max={Array.isArray(block.max) ? block.max[inputIndex] : block.max}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder={defaultValue}
          style={{ zIndex: 10 }}
        />
        {block.description && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {block.description}
          </div>
        )}
      </div>
    );
  };

  const renderBlockContent = (block: BlockData, blockIndex: number) => {
    const color = getBlockColor(block.category || "");
    const textParts = getTextIcon(block, 0).split("$input");

    return (
      <div
        className={`flex items-center gap-3 w-fit max-w-full px-4 py-2 rounded-xl
          bg-${color}-100 shadow-sm hover:shadow-md transition duration-200`}
      >
        {/* Command text with inline inputs */}
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-800">
          {textParts.map((part, index) => (
            <React.Fragment key={index}>
              {part && <span>{part}</span>}
              {index < textParts.length - 1 && (
                <span className="inline-block w-16">
                  {renderInput(block, blockIndex, index)}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {data.map((block, i) => (
        <div
          draggable
          onDragStart={drag as any}
          id={title + i}
          key={title + i}
          className={`
      flex items-center justify-between w-full sm:flex-row px-3 py-3 mb-3 rounded-lg
      bg-${getBlockColor(
        title
      )}-200 shadow-sm cursor-grab transition hover:scale-[1.02]
    `}
          style={{ position: "relative" }}
          data-cmd={getTextIcon(block, 0)}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`
          inline-block px-2 py-1 text-xs font-semibold rounded-full
          bg-${getBlockColor(title)}-500 text-white
        `}
            >
              {block.category}
            </span>
            {renderBlockContent(block, i)}
            {getTextIcon(block, 1) && (
              <Icon
                name={getTextIcon(block, 1)}
                size={14}
                className="text-indigo-600"
              />
            )}
            <BlockWrapper text={getTextIcon(block, 2)} />
          </div>
        </div>
      ))}
    </>
  );
};

export default SidebarItem;
