import { moveCat, sleepFor, turnCat } from "./common";

interface Command {
  cmdText: string;
}

type CommandMap = Record<string, Command[]>;

export default async function commandParser(
  commands: CommandMap
): Promise<void> {
  console.log("commands", commands);
  for (const [spriteId, cmds] of Object.entries(commands)) {
    const element = document.querySelector(`#${spriteId}`);
    if (!(element instanceof HTMLElement)) continue;

    const spriteElement = element as HTMLElement;

    for (let i = 0; i < cmds.length; i++) {
      const cmd = cmds[i];
      const text = cmd.cmdText.toLowerCase();

      try {
        // Handle "move" command
        if (text.includes("move")) {
          const match = text.match(/move\s+(\d+)\s+steps/);
          if (match) {
            const steps = parseInt(match[1]);
            if (!isNaN(steps)) {
              console.log(`Moving ${steps} steps for ${spriteId}`);
              moveCat(spriteElement, steps);
              await sleepFor(0.5, "second");
            }
          }

          // Handle "turn" command
        } else if (text.includes("turn")) {
          const match = text.match(/\d+/);
          if (match) {
            const degree = parseInt(match[0]);
            if (!isNaN(degree)) {
              let dir = "CW"; // Default to clockwise
              if (text.includes("acw") || text.includes("anti-clockwise")) {
                dir = "ACW";
              } else if (text.includes("cw") || text.includes("clockwise")) {
                dir = "CW";
              }
              console.log(`Turning ${spriteId} by ${degree} degrees ${dir}`);
              turnCat(spriteElement, degree, dir);
              await sleepFor(0.5, "second");
            }
          }

          // Handle "go to" command
        } else if (text.includes("go to")) {
          console.log(`Moving ${spriteId} to position`);
          const matches = text.match(/x:\s*(-?\d+)\s*y:\s*(-?\d+)/);
          if (matches) {
            const x = parseInt(matches[1]);
            const y = parseInt(matches[2]);
            if (!isNaN(x) && !isNaN(y)) {
              spriteElement.style.transform = `translate(${x}px, ${y}px)`;
              console.log(`Moved ${spriteId} to x=${x}, y=${y}`);
              await sleepFor(0.5, "second");
            }
          }

          // Handle "repeat" command
        } else if (text.includes("repeat")) {
          console.log("repeat", text);
          const match = text.match(/\d+/);
          if (match) {
            const times = parseInt(match[0]);
            if (!isNaN(times)) {
              const nextCmd = cmds[i - 1];
              console.log("times", nextCmd);
              if (nextCmd) {
                for (let j = 0; j < times; j++) {
                  await commandParser({ [spriteId]: [nextCmd] });
                }
                i++; // Skip the next command since it's been handled
              }
            }
          }
        }
      } catch (error) {
        console.error(
          `Error executing command for ${spriteId}: ${cmd.cmdText}`,
          error
        );
      }
    }
  }
}
