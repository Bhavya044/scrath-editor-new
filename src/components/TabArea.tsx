import React, { useState } from "react";
import { drag } from "../utils/dragAndDrop";
import SVGModal from "./UI/SVGmodal";
import useStore from "../store/store";

function TabArea() {
  const { tabs, currentTab, addTab, switchTab, removeTab, setImages } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getName = (id: string) => "Sprite " + id.match(/\d+/)?.[0];

  const toggleTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    switchTab(e.currentTarget.dataset.tab!);
  };

  const addTabs = () => {
    if (tabs.length >= 6) return;
    addTab();
    setIsModalOpen(true);
  };

  const handleSelectSVG = (selectedSVG: string) => {
    setImages(currentTab, selectedSVG);
    setIsModalOpen(false);
  };

  const handleRemoveTab = (tabId: string) => {
    removeTab(tabId);
  };

  return (
    <>
      {/* Tab Bar */}
      <div className="w-full bg-white px-4 py-3 rounded-t-lg shadow-sm">
        <div className="flex gap-3 items-center overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab === currentTab;
            return (
              <div
                key={tab}
                className={`relative flex items-center whitespace-nowrap rounded-full transition-all duration-200 shadow-sm
                ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
              `}
              >
                <button
                  draggable
                  onDragStart={drag}
                  id={`sprite-${tab}`}
                  data-tab={tab}
                  onClick={toggleTab}
                  className="px-4 py-1.5 text-sm font-medium focus:outline-none"
                >
                  {getName(tab)}
                </button>

                {tab !== "S1" && (
                  <button
                    onClick={() => handleRemoveTab(tab)}
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs
                      ${isActive ? "bg-white text-blue-600" : "bg-gray-100 text-gray-600"}
                      hover:bg-red-500 hover:text-white transition`}
                    title="Remove"
                  >
                    x
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Tab Button */}
          <button
            onClick={addTabs}
            className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold hover:bg-green-600 transition-all duration-200 shadow-md"
            title="Add Sprite"
          >
            +
          </button>
        </div>
      </div>

      {/* Drop Area */}
      <div className="flex justify-center mt-4">
        <span className="px-4 py-1.5 text-sm bg-purple-100 text-purple-800 rounded-full shadow-sm">
          Drop Here @ <span className="font-semibold">{getName(currentTab)}</span>
        </span>
      </div>

      {/* SVG Selector Modal */}
      <SVGModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectSVG}
      />
    </>
  );
}

export default TabArea;
