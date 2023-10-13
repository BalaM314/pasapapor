import "jasmine";
import { getPaporFromInput, smartParseInput } from "../src/papor.js";
const tests1 = ((d) => d.map(l => [l[0], l[1], l[2].split("+")]))([
    ["9231_w21_qp_43", null, "9231_w21_qp_43"],
    ["9231 w21 qp 43", null, "9231_w21_qp_43"],
    ["__9231-w21  qp/43", null, "9231_w21_qp_43"],
    ["9231_w21_43", null, "9231_w21_ms_43+9231_w21_qp_43"],
    ["9231_w21_er", null, "9231_w21_er"],
    ["9231_w21_gt", null, "9231_w21_gt"],
    ["9701_w21_ci_31", null, "9701_w21_ci_31"],
]);
const tests2 = ((d) => d.map(l => [l[0], l[1], l[2].split("+")]))([
    ["9231_w21_qp_43", null, "9231_w21_qp_43"],
    ["9231 w21 qp 43", null, "9231_w21_qp_43"],
    ["__9231-w21  qp/43", null, "9231_w21_qp_43"],
    ["9231_w21_43", null, "9231_w21_ms_43+9231_w21_qp_43"],
]);
describe("regular parser", () => {
    for (const [input, level, outputs] of tests1) {
        it(`should parse ${input} with level ${level} to ${outputs.join("+")}`, () => {
            expect(getPaporFromInput(input, level, false).map(o => o.cleanString())).toEqual(outputs);
        });
    }
});
describe("smart parser", () => {
    for (const [input, level, outputs] of tests2) {
        it(`should parse ${input} with level ${level} to ${outputs.join("+")}`, () => {
            expect(smartParseInput(input, level).map(o => o.cleanString())).toEqual(outputs);
        });
    }
});
