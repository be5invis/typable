# `typable`

`typable` is a mini library to include dynamic casting in TypeScript.

## Class `TypeRep<T>`

### `new TypeRep<T>(uniqueName:string, …inheritance: TypeRep<any>[])`

Creates a `TypeRep` for type `T`.

### `TypeRep<T>::is<R>(other: TypeRep<R>): this is TypeRep<T&R>`

Detects whether this `typeRep` is a sub-type-rep of `other`.

### `TypeRep<T>::equal<R>(other: TypeRep<R>):this is TypeRep<T&R>`

Detects whether this `typeRep` is equivalent to `other`.

Identical to `typeRep.is(other) && other.is(typeRep)`.

## Interface `Typable<T = {}>`

### `Typable<T>::dynamicCast<U>(tr: TypeRep<U>): undefined | U`

This method is required for all `Typable`s to implement: given a `TypeRep<U>`, the object should return an instance of `U`, if `T` is a subtype of `U`, or `undefined` for other cases. `TypeRep<T>::is` could be used in implementation.

## Function `implDynamicCast<U, T>(tr: TypeRep<U>, obj: Typable<T>, trObj: TypeRep<T>): undefined | U`

This function is an utility function used to simplify implementation of `dynamicCast`. Typical use is:

```typescript
const TypeRepOfC = new TypeRep<C>(......);
class CImpl implements Typable<C> {
	public a = 1;
	public b = 2;
	public c = 3;

	dynamicCast<U>(tr: TypeRep<U>): undefined | U {
		return implDynamicCast(tr, this, TypeRepOfC);
	}
}
```

## Sample

```typescript
import { implDynamicCast, Typable, TypeRep } from "typable";

const A = new TypeRep<A>("A");
interface A {
	readonly a: number;
}
const B = new TypeRep<B>("B", A);
interface B extends A {
	readonly b: number;
}
const C = new TypeRep<C>("C", A);
interface C extends A {
	readonly c: number;
}
const D = new TypeRep<D>("D", B, C);
interface D extends B, C {
	readonly d: number;
}

class CImpl implements Typable<C> {
	public a = 1;
	public b = 2;
	public c = 3;

	dynamicCast<U>(tr: TypeRep<U>): undefined | U {
		return implDynamicCast(tr, this, C);
	}
}
class BCImpl implements Typable<B>, Typable<C> {
	public a = 1;
	public b = 2;
	public c = 3;

	dynamicCast<U>(tr: TypeRep<U>): undefined | U {
		return implDynamicCast(tr, this, B) || implDynamicCast(tr, this, C);
	}
}
class DImpl implements Typable<D> {
	public a = 1;
	public b = 2;
	public c = 3;
	public d = 4;

	dynamicCast<U>(tr: TypeRep<U>): undefined | U {
		return implDynamicCast(tr, this, D);
	}
}
```