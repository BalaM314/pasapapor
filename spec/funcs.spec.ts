import "jasmine";
import { impossible, replaceMatch } from "../src/funcs.js";

describe("never", () => {
	it("should not return", () => {
		expect(impossible).toThrow();
	});
});

describe("replaceMatch", () => {
	it("should replace a match", () => {
		expect(replaceMatch("sussy amogus", "sussy amogus".match(/y/)!, "@")).toEqual("suss@ amogus");
		expect(replaceMatch("sussy amogus", "sussy amogus".match(/s$/)!, "@")).toEqual("sussy amogu@");
	});
});
