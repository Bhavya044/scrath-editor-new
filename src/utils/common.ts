// Generator function that yields numbers up to `times`
export function* makeRangeIterator(
  times: number
): Generator<number, number, unknown> {
  let iterationCount = 0;
  for (let i = 0; i < times; i++) {
    iterationCount++;
    yield i;
  }
  return iterationCount;
}

// Utility sleep function
export const sleep = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

// Unit options
type TimeUnit = "milisecond" | "second" | "minute";

// Sleep for specific time and unit
export const sleepFor = async (time: number, unit: TimeUnit): Promise<void> => {
  switch (unit) {
    case "milisecond":
      await sleep(time);
      return;
    case "second":
      await sleep(time * 1000);
      return;
    case "minute":
      await sleep(time * 1000 * 60);
      return;
    default:
      await sleep(time * 1000);
      return;
  }
};

// Move a cat element in the direction it's facing
export const moveCat = (
  cat: HTMLElement,
  steps: number = 1,
  speed: number = 1
): void => {
  const currentTransform = cat.style.transform || "";
  console.log("Current transform:", currentTransform);

  const translateMatch = currentTransform.match(/translate\(([^)]+)\)/);
  let currentX = 0;
  let currentY = 0;

  if (translateMatch) {
    const [x, y] = translateMatch[1]
      .split(",")
      .map((str) => parseFloat(str.trim().replace("px", "")));
    currentX = x || 0;
    currentY = y || 0;
  } else {
    console.log("No current translation found, defaulting to x=0, y=0");
  }

  const rotateMatch = currentTransform.match(/rotate\(([^)]+)deg\)/);
  let currentRotation = 0;

  if (rotateMatch) {
    currentRotation = parseFloat(rotateMatch[1]) || 0;
  }
  console.log("Current rotation:", currentRotation);

  const radians = (currentRotation * Math.PI) / 180;
  console.log(`Current rotation in radians: ${radians}`);

  const moveX = Math.cos(radians) * steps * speed;
  const moveY = Math.sin(radians) * steps * speed;

  console.log(`Calculated movement -> X: ${moveX}, Y: ${moveY}`);

  const newX = currentX + moveX;
  const newY = currentY + moveY;
  console.log(`New position -> x: ${newX}, y: ${newY}`);

  let newTransform = `translate(${newX}px, ${newY}px)`;
  if (rotateMatch) {
    newTransform += ` rotate(${currentRotation}deg)`;
  }

  console.log("Applying new transform:", newTransform);
  cat.style.transform = newTransform;
};

// Turn the cat by a given degree in the specified direction
export const turnCat = (
  cat: HTMLElement,
  degree: number,
  dir: string
): void => {
  const currentTransform = cat.style.transform || "";
  const rotateMatch = currentTransform.match(/rotate\(([^)]+)\)/);
  let currentRotation = 0;

  if (rotateMatch) {
    currentRotation = parseInt(rotateMatch[1]) || 0;
  }

  const rotation =
    dir === "CW" ? currentRotation + degree : currentRotation - degree;
  cat.style.transform =
    currentTransform.replace(/rotate\([^)]+\)/, "") + ` rotate(${rotation}deg)`;
};

// Check if a function is a generator function
export const isGeneratorFunc = (func: unknown): boolean => {
  if (!func || typeof func !== "function") return false;
  return func.constructor.name === makeRangeIterator.constructor.name;
};

// Utility to extract text and icon from a string
interface TextIconData {
  text: string;
  icon?: string;
}

export function getTextIcon(
  data: TextIconData | null | undefined,
  index: number
): string {
  if (!data || !data.text) return "";

  const parts = data.text.split("#icon");

  if (index === 0) {
    return parts[0]?.trim() || "";
  } else if (index === 1) {
    return data.icon || "";
  }

  return "";
}
