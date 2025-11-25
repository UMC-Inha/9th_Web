import { useEffect, useRef, useState } from "react";

export function useThrottle(value: boolean, delay: number) {
  const [throttleValue, setThrottleValue] = useState(false);

  //throttle이 동작중인지 확인하는 timer
  const timer = useRef(false);

  //최신 value 값 저장
  const lastValue = useRef(value);
  lastValue.current = value;

  useEffect(() => {
    const trigger = () => {
      if (timer.current || !lastValue.current) {
        return;
      }

      //delay 시간동안 재발동 금지
      timer.current = true;

      //true -> false 잠깐의 펄스
      setThrottleValue(true);
      setTimeout(() => {
        setThrottleValue(false);
      }, 100);

      //delay 이후 trigger 여부 결정
      setTimeout(() => {
        //throttle이 끝났으므로 timer 정지
        timer.current = false;

        if (lastValue.current === true) {
          trigger();
        }
      }, delay);
    };

    if (value === true) {
      trigger();
    } else {
      setThrottleValue(false);
    }
  }, [value, delay]);

  return throttleValue;
}
