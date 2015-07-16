export function createSelectorCreator(valueEquals) {
    return (selectors, resultFunc) => {
        if (!Array.isArray(selectors)) {
            selectors = [selectors];
        }
        const memoizedResultFunc = memoize(resultFunc, valueEquals);
        return state => {
            const params = selectors.map(selector => selector(state));
            return memoizedResultFunc(params);
        }
    };
}

export function createSelector(...args) {
    return createSelectorCreator(defaultValueEquals)(...args);
}

export function defaultValueEquals(a, b) {
    return a === b;
}

export function lazy(selector) {
    selector.__realised = false;
    selector.__cached = null;
    if (selector.__realised) return selector.__cached;
    return state => () => {
        let val = selector(state);
        selector.__cached = val;
        selector.__realised = true;
        return val;
    };
}

// the memoize function only caches one set of arguments.  This
// actually good enough, rather surprisingly. This is because during
// calculation of a selector result the arguments won't
// change if called multiple times. If a new state comes in, we *want*
// recalculation if and only if the arguments are different.
function memoize(func, valueEquals) {
    let lastArgs = null;
    let lastResult = null;
    return (args) => {
        if (lastArgs !== null && argsEquals(args, lastArgs, valueEquals)) {
            // if lazy this should be the wrapped function...
            return lastResult;
        }
        lastArgs = args;
        lastResult = func(...args);
        return lastResult;
    }
}

function argsEquals(a, b, valueEquals) {
    return a.every((value, index) => valueEquals(value, b[index]));
}
