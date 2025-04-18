/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import TabArea from "./TabArea";
import useStore from "../store/store";
import { allowDrop, drop } from "../utils/dragAndDrop";

const MidArea: React.FC = () => {
  const { tabs, currentTab } = useStore();
  const [dragOverTab, setDragOverTab] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const safeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const isValidTarget = e.currentTarget === e.target;

    if (!isValidTarget) {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
      return;
    }

    drop(e as any);
    setDragOverTab(null);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-gray-50 border-l border-r border-gray-200 rounded-md shadow-sm">
      <TabArea />
      <div className="flex-1 p-4">
        {tabs.map((tab: string) => (
          <div
            key={tab + "div"}
            onDrop={safeDrop}
            onDragOver={(e) => {
              allowDrop(e as any);
              setDragOverTab(tab);
            }}
            onDragLeave={() => setDragOverTab(null)}
            className={`relative transition-all duration-300 ease-in-out border-2 rounded-lg h-full w-full bg-white p-4 shadow-inner
              ${tab === currentTab ? "block" : "hidden"}
              ${
                dragOverTab === tab
                  ? "border-dashed border-blue-500 bg-blue-50"
                  : "border-transparent"
              }
              ${showError ? "border-red-500 bg-red-50" : ""}
            `}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MidArea;
