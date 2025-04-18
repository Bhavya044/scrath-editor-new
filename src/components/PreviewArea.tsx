import React, { useState } from "react";
import CatSprite from "./CatSprite";
import useStore from "../store/store";
import commandParser from "../utils/commandParser";

const PreviewArea: React.FC = () => {
  const { commands, images } = useStore();
  const [draggingCatId, setDraggingCatId] = useState<string | null>(null);

  const reset = () => {
    const cat = document.querySelector("#movingCat") as HTMLElement;
    if (cat) {
      cat.style.cssText = "";
    }
  };

  const execute = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.dataset.run) {
      await commandParser(commands);
    }
    if (target.dataset.reset) reset();
  };
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingCatId(id);

    const catElement = e.target as HTMLElement;
    catElement.style.opacity = "0.5"; // Make it semi-transparent while dragging
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const catElement = e.target as HTMLElement;
    catElement.style.opacity = "1"; // Reset opacity after dragging
    setDraggingCatId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Get the drop area dimensions
    const dropArea = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - dropArea.left;
    const dropY = e.clientY - dropArea.top;

    // Check if draggingCatId is set (i.e., we are dragging a sprite)
    if (draggingCatId) {
      const catElement = document.querySelector(
        `#${draggingCatId}`
      ) as HTMLElement;
      if (catElement) {
        catElement.style.position = "absolute"; // Use absolute positioning to freely move the sprite
        catElement.style.left = `${dropX - 50}px`; // Center sprite at the drop position
        catElement.style.top = `${dropY - 50}px`; // Center sprite at the drop position
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow the drop event
  };

  return (
    <div
      onClick={execute}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative w-full h-full overflow-y-auto p-2"
    >
      {Object.entries(images).map(([key, svg]) => (
        <CatSprite
          key={key}
          id={key}
          className="w-max"
          img={svg}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
      <button
        className="fixed right-5 bottom-5 bg-green-500 hover:bg-green-700 text-gray-50 rounded-full h-12 w-12"
        data-run
      >
        <span className="text-lg" data-run>
          ▶
        </span>
      </button>
      <button
        className="fixed right-20 bottom-5 bg-red-500 hover:bg-red-700 text-gray-50 rounded-full h-12 w-12"
        data-reset
      >
        <span className="text-lg" data-reset>
          ↻
        </span>{" "}
        {/* Reset icon */}
      </button>
    </div>
  );
};

export default PreviewArea;
