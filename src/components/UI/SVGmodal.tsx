import React, { useState } from "react";
import useStore from "../../store/store";

interface SVGModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedSVG: string) => void;
}

const SVGModal: React.FC<SVGModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedSVG, setSelectedSVG] = useState<string>("");
  const { setImages, currentTab } = useStore(); // Assuming setImages updates the selected SVG in your Zustand store

  const handleSelect = (svg: string) => {
    setSelectedSVG(svg); // Set the selected SVG in the local state
  };

  const handleConfirm = () => {
    if (selectedSVG) {
      setImages(currentTab, selectedSVG);
      onSelect(selectedSVG); // Optionally pass it back to the parent if needed
      onClose(); // Close the modal
    }
  };

  if (!isOpen) return null;

  const svgFiles = [
    "dog.svg",
    "cat.svg",
    "man.svg",
    "strawberry.svg",
    "woman.svg",
    "girl.svg",
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white/70 bg-opacity-10 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl mb-4">Select new Sprite</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Map over the SVG file names and render them as clickable images */}
          {svgFiles.map((file, idx) => (
            <div
              key={idx}
              className={`p-2 border border-gray-300 rounded-lg cursor-pointer ${
                selectedSVG === file ? "border-blue-500 bg-blue-100" : ""
              }`} // Highlight selected SVG with a border and background
              onClick={() => handleSelect(file)}
            >
              <img
                src={`/${file}`} // Path to SVGs in the public folder
                alt={file}
                className="w-12 h-12 mx-auto" // Adjust the size as needed
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Close
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SVGModal;
