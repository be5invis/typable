export class TypeRep<T> {
	constructor(public readonly uniqueName: string, ...inheritance: TypeRep<any>[]) {
		const acceptableTypeNames = new Set<string>();
		for (const base of inheritance) {
			for (const tr of base.acceptableTypeNames) acceptableTypeNames.add(tr);
		}
		acceptableTypeNames.add(this.uniqueName);
		this.acceptableTypeNames = new Set(acceptableTypeNames);
	}
	private readonly acceptableTypeNames: Set<string>;
	is<R>(type: TypeRep<R>): this is TypeRep<T & R> {
		return this.acceptableTypeNames.has(type.uniqueName);
	}
	equal<R>(that: TypeRep<R>): this is TypeRep<T & R> {
		return this.is(that) && that.is(this);
	}
}

export interface TypableInterface<T> {
	dynamicCast<U>(tr: TypeRep<U>): undefined | U;
}

export type Typable<T> = T & TypableInterface<T>;

export function implDynamicCast<U, T>(
	tr: TypeRep<U>,
	obj: Typable<T>,
	trObj: TypeRep<T>
): undefined | U {
	if (trObj.is(tr)) return (obj as any) as U;
	else return undefined;
}
