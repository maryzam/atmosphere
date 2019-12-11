import { useRef, useLayoutEffect } from "react";

const isBrowser = typeof window !== "undefined";

const getScrollPosition = ({ element }) => {
 	if (!isBrowser) { 
 		throw new Error("useScrollPosition hook is unavailable in non-browser mode.");
 	}

 	const target = element ? element.current : document.body;
 	const position = target.getBoundingClientRect();

 	return { 
 		x: Math.floor(position.left),
 		y: Math.floor(position.top) 
 	};
}

const getThrottledCallback = ({ callback, delay = 100 }) => {
	if (delay < 1) {
		throw new Error("Delay between callback calls should be positive number");
	}

	let scheduledCallbackRun = null;

	const cancelDelayedCallback = () => {
		if (scheduledCallbackRun == null) {
			return;
		}
		clearTimeout(scheduledCallbackRun);
		scheduledCallbackRun = null;
	};

	const setDelayedCallback = () => {
		if (scheduledCallbackRun == null) {
			scheduledCallbackRun = setTimeout(() => {
				callback();
				cancelDelayedCallback();
			}, delay)
		}
	};

	return { setDelayedCallback, cancelDelayedCallback };
}

const useScrollPosition = ({ effect, element = null, delay = 200 }) => {

	const position = useRef(getScrollPosition({}));
	const updateCurrentPos = () => {
		const currPos = getScrollPosition({ element });
    	effect({ prevPos: position.current, currPos });
    	position.current = currPos;
	}

	const { 
		setDelayedCallback, 
		cancelDelayedCallback
	} = getThrottledCallback({ callback: updateCurrentPos });

	useLayoutEffect(() => {

		const registerHook = () => window.addEventListener('scroll', setDelayedCallback);
		const unregisterHook = () => {
			window.removeEventListener('scroll', setDelayedCallback);
			cancelDelayedCallback();
		};

		registerHook();

		return unregisterHook;
	})
}

export default useScrollPosition;