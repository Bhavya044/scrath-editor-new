interface BlockWrapperProps {
  text: string;
}

function BlockWrapper({ text }: BlockWrapperProps) {
  if (text.includes("$")) {
    const splittedText = text.split("$");
    const toHide = splittedText.pop();
    const JSXText = (
      <>
        {splittedText.join("")}
        <span className="hidden">{toHide}</span>
      </>
    );
    return JSXText;
  }
  return text;
}

export default BlockWrapper;
