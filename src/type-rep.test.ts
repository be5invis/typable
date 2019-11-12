import { implDynamicCast, Typable, TypeRep } from "./type-rep";

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
class DImpl implements Typable<D> {
	public a = 1;
	public b = 2;
	public c = 3;
	public d = 4;

	dynamicCast<U>(tr: TypeRep<U>): undefined | U {
		return implDynamicCast(tr, this, D);
	}
}

test("Dynamic casting 1", function() {
	const c = new CImpl();
	expect(c.dynamicCast(A)).toBeTruthy();
	expect(c.dynamicCast(B)).toBeFalsy();
	expect(c.dynamicCast(C)).toBeTruthy();
	expect(c.dynamicCast(D)).toBeFalsy();
});

test("Dynamic casting 2", function() {
	const d = new DImpl();
	expect(d.dynamicCast(A)).toBeTruthy();
	expect(d.dynamicCast(B)).toBeTruthy();
	expect(d.dynamicCast(C)).toBeTruthy();
	expect(d.dynamicCast(D)).toBeTruthy();
});

test("TypeRep equality and inheritance", function() {
	expect(A.is(B)).toBe(false);
	expect(B.is(A)).toBe(true);
	expect(A.is(D)).toBe(false);
	expect(D.is(A)).toBe(true);
	expect(B.is(D)).toBe(false);
	expect(D.is(B)).toBe(true);
});
