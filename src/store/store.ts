import { create } from "zustand";

// Define types for the state
interface Command {
  cmdID: string;
  cmdText: string;
}

interface Store {
  tabCount: number;
  tabs: string[];
  currentTab: string;
  commands: { [key: string]: Command[] };
  images: { [key: string]: string };

  // Actions
  addTab: () => void;
  removeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  addCmd: (sprite: string, cmdID: string, cmdText: string) => void;
  removeCmd: (sprite: string, cmdId: string) => void;
  setImages: (sprite: string, imgUrl: string) => void;
}

// Zustand store
const useStore = create<Store>((set) => ({
  tabCount: 1,
  tabs: ["S1"],
  currentTab: "S1",
  commands: {},
  images: { S1: "woman.svg" },

  // Action to add a new tab
  addTab: () =>
    set((state) => {
      const newTabCount = state.tabCount + 1;
      return {
        tabs: [...state.tabs, `S${newTabCount}`],
        currentTab: `S${newTabCount}`,
        tabCount: newTabCount,
      };
    }),

  // Action to remove a tab
  removeTab: (tabId) =>
    set((state) => {
      if (tabId === "S1") return state;

      const filteredTabs = state.tabs.filter((tab) => tab !== tabId);
      const currentTab =
        filteredTabs.includes(state.currentTab) && filteredTabs.length
          ? state.currentTab
          : filteredTabs[filteredTabs.length - 1] || "S1";

      const newCommands = { ...state.commands };
      const newImages = { ...state.images };

      delete newCommands[tabId];
      delete newImages[tabId];

      return {
        tabs: filteredTabs,
        currentTab,
        commands: newCommands,
        images: newImages,
      };
    }),

  // Action to switch the current tab
  switchTab: (tabId) =>
    set(() => ({
      currentTab: tabId,
    })),

  // Action to add a command to a sprite
  addCmd: (sprite, cmdID, cmdText) =>
    set((state) => {
      const newSpriteCmds = state.commands[sprite] || [];
      newSpriteCmds.push({ cmdID, cmdText });

      return {
        commands: {
          ...state.commands,
          [sprite]: newSpriteCmds,
        },
      };
    }),

  // Action to remove a command
  removeCmd: (sprite, cmdId) =>
    set((state) => {
      const updatedCmds = state.commands[sprite].filter(
        (cmd) => cmd.cmdID !== cmdId
      );

      return {
        commands: {
          ...state.commands,
          [sprite]: updatedCmds,
        },
      };
    }),

  // Action to set images for a specific sprite
  setImages: (sprite, imgUrl) =>
    set((state) => {
      return {
        images: {
          ...state.images,
          [sprite]: imgUrl, // Setting the image URL for the sprite
        },
      };
    }),
}));

export default useStore;
