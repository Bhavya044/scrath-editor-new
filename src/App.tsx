import React, { useState, useRef, useEffect } from "react";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const [previewWidth, setPreviewWidth] = useState(33.33); // Initial width as percentage
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = previewWidth;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;

    const containerWidth = window.innerWidth;
    const deltaX = e.clientX - startX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;

    // Calculate new width (clamped between 20% and 50%)
    const newWidth = Math.min(
      Math.max(startWidth.current - deltaPercent, 20),
      50
    );
    setPreviewWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar /> <MidArea />
        </div>
        <div
          className="h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2"
          style={{ width: `${previewWidth}%` }}
        >
          <div
            className="w-2 cursor-col-resize hover:bg-gray-300 active:bg-gray-400 transition-colors flex items-center justify-center"
            onMouseDown={handleMouseDown}
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
          </div>
          <PreviewArea />
        </div>
      </div>
    </div>
  );
};

export default App;
