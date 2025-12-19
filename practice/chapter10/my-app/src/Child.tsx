import { memo } from "react";

function Child({ onClick }: { onClick: () => void }) {
  console.log("Child render");
  return <button onClick={onClick}>자식 버튼</button>;
}

export default memo(Child);
