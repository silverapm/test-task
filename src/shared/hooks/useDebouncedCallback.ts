import { useCallback, useEffect, useRef } from 'react';

type AnyVoidFn = (...args: any[]) => void;

export function useDebouncedCallback<F extends AnyVoidFn>(callback: F, delayMs: number) {
    const callbackRef = useRef<F>(callback);
    const timeoutIdRef = useRef<number | null>(null);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const cancel = useCallback(() => {
        if (timeoutIdRef.current === null) return;
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
    }, []);

    const debounced = useCallback(
        (...args: Parameters<F>) => {
            cancel();
            timeoutIdRef.current = window.setTimeout(() => {
                callbackRef.current(...args);
            }, delayMs);
        },
        [cancel, delayMs]
    );

    useEffect(() => cancel, [cancel]);

    return { debounced, cancel };
}
