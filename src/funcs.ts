import { FunctionProps } from "./types.js";

export function timeFunction<TObj extends Record<string, unknown> | Window>(obj:TObj, key:FunctionProps<TObj>):void;
export function timeFunction<T extends (...args:any[]) => unknown>(func:T):T;

export function timeFunction(arg1:unknown, arg2?:unknown){
	if(typeof arg1 == "function"){
		const func:any = arg1;
		return function(...args:any[]){
			console.time(func.name);
			const output = func(...args);
			console.timeEnd(func.name);
			return output;
		};
	} else {
		//typescript function overloads suck
		const obj:any = arg1;
		const key:any = arg2;
		const desc = Object.getOwnPropertyDescriptor(obj, key);
		if(!desc) fail(`Property ${String(key)} does not exist in object ${obj}`);
		if(!desc.writable) fail(`Property ${String(key)} is not writable`);
		const value:any = obj[key];
		obj[key] = function(...args:any[]){
			console.time(String(key));
			const output = value(...args);
			console.timeEnd(String(key));
			return output;
		} as any;
	}
}

/** Gets an HTML element of a particular type. */
export function getElement<T extends typeof Element>(selector:string, type:T):T["prototype"] {
	const elements = Array.from(document.querySelectorAll(selector))
		.filter((e):e is T["prototype"] => e instanceof type);
	if(elements[0]) return elements[0];
	if(document.querySelectorAll(selector).length > 1) fail(`No elements matching ${selector} were of type ${type.name}`);
	else if(document.querySelector(selector)) fail(`Element matching ${selector} was of type ${document.querySelector(selector)!.constructor.name}, not ${type.name}`);
	else fail(`No elements matched selector ${selector}`);
}

/**
 * Helper function to display a popup on first use of a feature. Do not overuse as getting spammed with alert() is annoying.
 * @param key Gets "pasapapor-" prepended to it.
 * @param message Message displayed in the alert box.
 * @param callback Called if it is not the first use.
 */
export function firstUsePopup(key:string, message:string, callback?:() => unknown, runCallbackAfterMessage = false){
	const lsKey = `pasapapor-${key}`;
	if(localStorage.getItem(lsKey) != null){
		callback?.();
	} else {
		alert(message);
		localStorage.setItem(lsKey, "true");
		if(runCallbackAfterMessage) callback?.();
	}
}

export function impossible():never {
	throw new Error("Unreachable code was reached!");
}
export function fail(message:string):never {
	throw new Error(message);
}

export function replaceMatch(string:string, match:RegExpMatchArray, replacement = ""){
	return string.slice(0, match.index!) + replacement + string.slice(match.index! + match[0].length);
}

export function escapeHTML(input:string):string {
	return input.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(`"`, "&quot;").replaceAll(`'`, "&apos;");
}

export function match<K extends PropertyKey, O extends Record<K, unknown>>(value:K, clauses:O):O[K];
export function match<K extends PropertyKey, O extends Partial<Record<K, unknown>>, D>(value:K, clauses:O, defaultValue:D):O[K] | D;
export function match(value:PropertyKey, clauses:Record<PropertyKey, unknown>, defaultValue?:unknown):unknown {
	return value in clauses ? clauses[value] : defaultValue;
}
