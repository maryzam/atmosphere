import { useRef, useLayoutEffect } from "react";

const isBrowser = typeof window !== "undefined";

const calcRelativeScrollPosition = ({ element }) => {
 	if (!isBrowser) { 
 		throw new Error("useScrollPosition hook is unavailable in non-browser mode.");
 	}

 	const target = element ? element.current : document.body;
 	const position = target.getBoundingClientRect();

 	const maxHeight = position.height - window.innerHeight;
 	const maxWidth = position.width - window.innerWidth;
 	const x = 1 + (position.left / maxWidth);
 	const y = 1 + (position.top / maxHeight);

 	return { 
 		x: x.toFixed(2),
 		y: y.toFixed(2) 
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

const useRelativeScrollPosition = ({ effect, element = null, delay = 200 }) => {

	const position = useRef(calcRelativeScrollPosition({}));

	const updateCurrentPos = () => {
		const currPos = calcRelativeScrollPosition({ element });
    	effect({ prevPos: position.current, currPos });
    	position.current = currPos;
	}

	const { 
		setDelayedCallback, 
		cancelDelayedCallback
	} = getThrottledCallback({ callback: updateCurrentPos });

	useLayoutEffect(() => {

		const registerHook = () => {
			window.addEventListener('scroll', setDelayedCallback);
			window.addEventListener('resize', setDelayedCallback);
		}

		const unregisterHook = () => {
			window.removeEventListener('scroll', setDelayedCallback);
			window.addEventListener('resize', setDelayedCallback);
			cancelDelayedCallback();
		};

		registerHook();

		return unregisterHook;
	})
}

export default useRelativeScrollPosition;