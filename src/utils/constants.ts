/* eslint-disable @typescript-eslint/no-explicit-any */
const blocks: any = {
  Control: [
    {
      text: "Repeat $input times",
      input: "number",
      defaultValue: "10",
      description: "Number of times to repeat",
      category: "Control",
    },
  ],
  Motion: [
    {
      text: "Move $input steps",
      input: "number",
      defaultValue: "10",
      description: "Number of steps to move",
      min: 0,
      max: 100,
      category: "Motion",
    },
    {
      text: "Turn $input degrees #icon",
      icon: "undo",
      input: "number",
      defaultValue: "15",
      min: 0,
      max: 360,
      category: "Motion",
    },
    {
      text: "Turn $input degrees #icon",
      icon: "redo",
      input: "number",
      defaultValue: "15",
      min: 0,
      max: 360,
      category: "Motion",
    },
    {
      text: "Go to x: $input y: $input",
      input: ["number", "number"],
      defaultValue: ["0", "0"],
      description: "Target coordinates",
      min: [-500, -500],
      max: [500, 500],
      category: "Motion",
    },
  ],
};

const getBlockColor = (blockName: any) => {
  switch (blockName) {
    case "Control":
      return "red";
    case "Events":
      return "yellow";
    case "Looks":
      return "purple";
    case "Motion":
      return "blue";

    default:
      return "green";
  }
};

export { blocks, getBlockColor };
