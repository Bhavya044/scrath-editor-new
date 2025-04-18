import useStore from "../store/store";

let count = 0;

export function allowDrop(ev: DragEvent): void {
  ev.preventDefault();
}

export function drag(ev: DragEvent): void {
  const target = ev.target as HTMLElement;
  const blockId: string = target.id;
  const inputValues: string[] = [];

  const inputs = target.querySelectorAll<HTMLInputElement>(
    'input[type="number"]'
  );

  inputs.forEach((input: HTMLInputElement) => {
    inputValues.push(input.value);
  });

  let cmdText: string = target.getAttribute("data-cmd") || "";

  if (cmdText.toLowerCase().includes("repeat")) {
    const repeatTimes: string = inputs[0].value;
    const nextBlock = target.nextElementSibling as HTMLElement | null;
    const prevBlock = target.previousElementSibling as HTMLElement | null;

    let connectedBlockId: string | null = null;

    if (nextBlock) {
      connectedBlockId = nextBlock.id;
    } else if (prevBlock) {
      connectedBlockId = prevBlock.id;
    }

    if (ev.dataTransfer) {
      ev.dataTransfer.setData(
        "repeatConnect",
        JSON.stringify({ blockId, connectedBlockId, repeatTimes })
      );
    }
  }

  inputs.forEach((input: HTMLInputElement) => {
    const value: string = input.value || input.placeholder;
    cmdText = cmdText.replace("$input", value);
  });

  if (ev.dataTransfer) {
    ev.dataTransfer.setData("dragId", blockId);
    ev.dataTransfer.setData("inputValues", JSON.stringify(inputValues));
    ev.dataTransfer.setData("cmdText", cmdText);
  }
}

export function drop(ev: DragEvent): void {
  ev.preventDefault();

  const id: string = ev.dataTransfer?.getData("dragId") || "";
  const inputValues: string[] = JSON.parse(
    ev.dataTransfer?.getData("inputValues") || "[]"
  );
  const cmdText: string = ev.dataTransfer?.getData("cmdText") || "";
  const repeatConnect: {
    blockId: string;
    connectedBlockId: string | null;
    repeatTimes: string;
  } = JSON.parse(ev.dataTransfer?.getData("repeatConnect") || "{}");

  if (!id || id.startsWith("dragged") || id.startsWith("sprite")) {
    return;
  }

  const nodeCopy = document.getElementById(id)?.cloneNode(true) as HTMLElement;
  nodeCopy.id = "dragged" + id + count++;

  const inputs = nodeCopy.querySelectorAll<HTMLInputElement>(
    'input[type="number"]'
  );
  inputs.forEach((input: HTMLInputElement, index: number) => {
    if (inputValues[index]) {
      input.value = inputValues[index];
    }
    input.disabled = true;
  });

  const store = useStore.getState();
  const sprite: string = store.currentTab;

  store.addCmd(sprite, nodeCopy.id, cmdText);

  const originalBlock = document.getElementById(id);
  const blockColor =
    originalBlock?.className.match(/bg-(\w+)-500/)?.[1] || "blue";

  nodeCopy.className =
    "flex items-center px-3 py-2 my-2 text-sm cursor-move " +
    `bg-${blockColor}-50 text-${blockColor}-700 border-l-4 border-${blockColor}-500 ` +
    "rounded-md hover:bg-opacity-80 transition-colors duration-150 " +
    "relative group";

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "absolute top-0 right-0 m-1.5 p-0.5 " +
    "text-gray-500 hover:text-gray-700 " +
    "opacity-0 group-hover:opacity-100 transition-opacity duration-150";
  deleteBtn.innerHTML = "×";
  deleteBtn.onclick = () => {
    store.removeCmd(sprite, nodeCopy.id);
    nodeCopy.remove();
  };
  nodeCopy.appendChild(deleteBtn);

  const repeatBlock = document.createElement("div");
  repeatBlock.className =
    "flex flex-col bg-gray-200 text-gray-800 p-4 mb-4 rounded-lg border border-gray-400";
  repeatBlock.innerHTML = `
    <div class="font-semibold text-xl text-gray-700">Repeat ${repeatConnect.repeatTimes} Times</div>
    <div class="flex justify-center mt-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-center">${nodeCopy.outerHTML}</div>
      </div>
    </div>
  `;

  const targetBlock = document.getElementById(
    repeatConnect.connectedBlockId || ""
  );
  if (targetBlock) {
    targetBlock.insertAdjacentElement("afterend", repeatBlock);
  }

  const textElements = nodeCopy.querySelectorAll("span");
  textElements.forEach((span: HTMLSpanElement) => {
    span.className = `text-${blockColor}-700`;
  });

  nodeCopy.addEventListener("dragstart", drag);
  (ev.target as HTMLElement).appendChild(nodeCopy);
}

export function deleteDiv(ev: DragEvent, force: boolean = false): void {
  ev.preventDefault();

  const id: string = ev.dataTransfer?.getData("dragId") || "";

  if (!id.startsWith("dragged") && !force) return;

  const el = document.getElementById(id);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}
