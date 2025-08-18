import React, { useState } from "react";
import { twJoin } from "tailwind-merge";

interface Props {
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const BtnIcon: React.FC<Props> = (props) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <span
      title={props.title}
      className={twJoin(
        "inline-block size-[18px] ml-2 cursor-pointer transition-opacity align-middle text-black dark:text-white",
        isHovering ? "opacity-100" : "opacity-60",
        props.className
      )}
      style={props.style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={props.onClick}
    >
      {props.children}
    </span>
  );
};

export default BtnIcon;
