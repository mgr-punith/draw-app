import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <div
      className={` ${activated ? "text-white bg-black" : "text-black"} px-3 py-2 rounded-lg  hover:font-bold cursor-pointer`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
