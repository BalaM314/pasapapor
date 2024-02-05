import type { Level } from "./data";

export interface Openable {
	url(): string;
	cleanString(): string;
}

export type FunctionProps<T,
	_TKeys extends keyof T = keyof T
> = _TKeys extends unknown ? (
	T[_TKeys] extends Function ? _TKeys : never
) : never;


export interface PasapaporDatabase {
	[subjectID:string]: {
		[year:string]: {
			[code:string]: PasapaporData;
		}
	};
}
export interface PasapaporData {
	status: "in_progress" | "complete";
	/**Unix timestamp of the date, filled in with Date.now() */
	date: number;
}

export type SubjectMapping = Record<string, SubjectData>;

export interface SubjectData {
	id: string;
	level: Level;
	name: string;
}


declare global {
	interface ObjectConstructor {
		/**
		 * Returns an array of key/values of the enumerable properties of an object
		 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
		 */
		entries<const K extends PropertyKey, T>(o: Record<K, T>): [K, T][];
		keys<const K extends PropertyKey>(o: Record<K, unknown>): K[];
		values<const V>(o: Record<PropertyKey, V>): V[];
		fromEntries<const K extends PropertyKey, T>(entries: Iterable<readonly [K, T]>): Record<K, T>;
	}
	interface Array<T> {
		map<TThis extends Array<T>, U>(this:TThis, fn:(v:T, i:number, a:TThis) => U): number extends TThis["length"] ? U[] : { [K in keyof TThis]: U };
		/**
		 * Determines whether an array includes a certain element, returning true or false as appropriate.
		 * @param searchElement The element to search for.
		 * @param fromIndex The position in this array at which to begin searching for searchElement.
		 */
		includes(searchElement:unknown, fromIndex?:number):searchElement is T;
	}
	interface ReadonlyArray<T> {
		/**
		 * Determines whether an array includes a certain element, returning true or false as appropriate.
		 * @param searchElement The element to search for.
		 * @param fromIndex The position in this array at which to begin searching for searchElement.
		 */
		includes(searchElement:unknown, fromIndex?:number):searchElement is T;
	}
}
