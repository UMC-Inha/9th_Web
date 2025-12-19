import { useState, useCallback } from "react";
import Child from "./Child";

export default function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("child click");
  }, []);

  return (
    <div>
      <h1>count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        부모 state 변경
      </button>

      <Child onClick={handleClick} />
    </div>
  );
}
