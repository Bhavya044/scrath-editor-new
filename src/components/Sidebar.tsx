/* eslint-disable @typescript-eslint/no-explicit-any */
import { blocks } from "../utils/constants";
import { allowDrop, deleteDiv } from "../utils/dragAndDrop";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <div
      onDrop={deleteDiv as any}
      onDragOver={allowDrop as any}
      className="w-72 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200"
    >
      {Object.keys(blocks).map((blockName) => (
        <SidebarItem
          key={blockName}
          title={blockName}
          data={blocks[blockName]}
        />
      ))}
    </div>
  );
}
