import "jasmine";
import { getPaporFromInput } from "../src/papor.js";
const tests = ((d) => d.map(l => [l[0], l[1], l[2].split("+")]))([
    ["9231_w21_qp_43", null, "9231_w21_qp_43"],
]);
describe("regular parser", () => {
    for (const [input, level, outputs] of tests) {
        it(`should parse ${input} with level ${level} to ${outputs.join("+")}`, () => {
            expect(getPaporFromInput(input, level, false).map(o => o.cleanString())).toEqual(outputs);
        });
    }
});
