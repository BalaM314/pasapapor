
export interface Openable {
	url(): string;
	cleanString(): string;
}

export type FunctionProps<T,
	_TKeys extends keyof T = keyof T
> = _TKeys extends unknown ? (
	T[_TKeys] extends Function ? _TKeys : never
) : never;
