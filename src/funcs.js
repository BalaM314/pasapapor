export function timeFunction(arg1, arg2) {
    if (typeof arg1 == "function") {
        const func = arg1;
        return function (...args) {
            console.time(func.name);
            const output = func(...args);
            console.timeEnd(func.name);
            return output;
        };
    }
    else {
        //typescript function overloads suck
        const obj = arg1;
        const key = arg2;
        const desc = Object.getOwnPropertyDescriptor(obj, key);
        if (!desc)
            fail(`Property ${String(key)} does not exist in object ${obj}`);
        if (!desc.writable)
            fail(`Property ${String(key)} is not writable`);
        const value = obj[key];
        obj[key] = function (...args) {
            console.time(String(key));
            const output = value(...args);
            console.timeEnd(String(key));
            return output;
        };
    }
}
/** Gets an HTML element of a particular type. */
export function getElement(selector, type) {
    const elements = Array.from(document.querySelectorAll(selector))
        .filter((e) => e instanceof type);
    if (elements[0])
        return elements[0];
    if (document.querySelectorAll(selector).length > 1)
        fail(`No elements matching ${selector} were of type ${type.name}`);
    else if (document.querySelector(selector))
        fail(`Element matching ${selector} was of type ${document.querySelector(selector).constructor.name}, not ${type.name}`);
    else
        fail(`No elements matched selector ${selector}`);
}
/**
 * Helper function to display a popup on first use of a feature. Do not overuse as getting spammed with alert() is annoying.
 * @param key Gets "pasapapor-" prepended to it.
 * @param message Message displayed in the alert box.
 * @param callback Called if it is not the first use.
 */
export function firstUsePopup(key, message, callback, runCallbackAfterMessage = false) {
    const lsKey = `pasapapor-${key}`;
    if (localStorage.getItem(lsKey) != null) {
        callback === null || callback === void 0 ? void 0 : callback();
    }
    else {
        alert(message);
        localStorage.setItem(lsKey, "true");
        if (runCallbackAfterMessage)
            callback === null || callback === void 0 ? void 0 : callback();
    }
}
export function impossible() {
    throw new Error("Unreachable code was reached!");
}
export function fail(message) {
    throw new Error(message);
}
export function replaceMatch(string, match, replacement = "") {
    return string.slice(0, match.index) + replacement + string.slice(match.index + match[0].length);
}
export function escapeHTML(input) {
    return input.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(`"`, "&quot;").replaceAll(`'`, "&apos;");
}
