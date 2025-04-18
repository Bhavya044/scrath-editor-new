import { makeRangeIterator, moveCat, sleepFor, turnCat } from "./common";

// Type for command structure
interface Command {
  cmdID: string;
  cmdText: string;
}

// Wait and Repeat commands
export const controlCommands = async (
  cmd: string
): Promise<Generator<number, number, unknown> | void> => {
  const splitCmd = cmd.split(" ");
  switch (splitCmd[0]) {
    case "Wait":
      await sleepFor(
        parseInt(splitCmd[1]),
        splitCmd[2] as "milisecond" | "second" | "minute"
      );
      return;

    case "Repeat":
      if (splitCmd[2]) return makeRangeIterator(parseInt(splitCmd[1]));
      return;

    default:
      return;
  }
};

// Cat movement-related commands
export const motionCommands = async (cmd: string): Promise<void> => {
  const splitCmd = cmd.split(" ").filter((cmdStr) => cmdStr.trim());
  const cat = document.querySelector("#movingCat") as HTMLElement | null;

  if (!cat) return;

  switch (splitCmd[0]) {
    case "Move":
      moveCat(cat, parseInt(splitCmd[1]));
      return;

    case "Turn":
      turnCat(cat, parseInt(splitCmd[2]), splitCmd[1] as "CW" | "CCW");
      return;

    case "Go":
      if (splitCmd[1] === "to") {
        const x = parseInt(splitCmd[2].replace("x:", ""));
        const y = parseInt(splitCmd[4].replace("y:", ""));
        cat.style.transform = `translate(${x}px, ${y}px)`;
        return;
      }
      return;

    default:
      return;
  }
};

// Say and Think commands (console log instead of toast)
export const looksCommands = async (cmd: string): Promise<void> => {
  const splitCmd = cmd.split(" ").filter((cmdStr) => cmdStr.trim());

  const message = splitCmd[1];
  const duration = parseInt(splitCmd[3]) * 1000;

  switch (splitCmd[0]) {
    case "Say":
      displayMessage(`🗣️ ${message}`, duration);
      return;

    case "Think":
      displayMessage(`🤔 Thinking... ${message}`, duration);
      return;

    default:
      return;
  }
};

// Simple message displayer (you can change this to update UI instead of console)
const displayMessage = (message: string, duration: number) => {
  console.log(message);

  const messageBox = document.getElementById(
    "messageBox"
  ) as HTMLElement | null;
  if (messageBox) {
    messageBox.innerText = message;
    messageBox.style.opacity = "1";
    setTimeout(() => {
      messageBox.style.opacity = "0";
    }, duration);
  }
};

// Executes one command based on type
const commandRunner = async (
  cmd: Command
): Promise<void | Generator<number, number, unknown>> => {
  if (cmd.cmdID.includes("Control")) return controlCommands(cmd.cmdText);
  if (cmd.cmdID.includes("Events") || cmd.cmdID.includes("Motion"))
    return motionCommands(cmd.cmdText);
  if (cmd.cmdID.includes("Looks")) return looksCommands(cmd.cmdText);
};

// Repeats a list of commands using a generator
// const commandRepeater = async (
//   commands: Command[],
//   gen: Generator<number, number, unknown>
// ): Promise<void> => {
//   for (const _ of gen) {
//     await commandParser(commands);
//   }
// };

// Parses and executes a sequence of commands
const commandParser = async (commands: Command[]): Promise<void> => {
  for (const cmd of commands) {
    await commandRunner(cmd);
  }
};

export default commandParser;

// Text and icon extractor utility
interface TextIconData {
  text: string;
  icon?: string;
}

export const getTextIcon = (
  data: TextIconData | null | undefined,
  loc: number
): string | null => {
  if (!data) return null;

  const hasIcon = !!data.icon;
  const parts = hasIcon ? data.text.split("#icon") : [data.text];

  if (loc === 0) return parts[0];
  if (loc === 1) return data.icon ?? null;
  return parts[1] ?? "";
};
