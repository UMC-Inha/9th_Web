import { useCallback, useEffect, useRef } from "react";

function useThrottle <T extends (...args: any[]) => any> (func : T, delay : number) {
    const lastRunTime = useRef<number>(0);
    const timerId = useRef<number | null>(null);

    const throttle = useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        const timeSinceLastRun = now - lastRunTime.current;

        if (!timerId.current) {
            if (timeSinceLastRun >= delay) {
                lastRunTime.current = now;

                func(...args);
            }

            else {
                timerId.current = window.setTimeout(() => {
                    lastRunTime.current = Date.now();
                    timerId.current = null;

                    func(...args);
                }, delay - timeSinceLastRun);
            }
        }
    }, [func, delay])

    useEffect(() => {
        return () => {
            if (timerId.current) {
                clearTimeout(timerId.current);
            }
        }
    }, [func, delay])

    return throttle;
}