import "jasmine";
import { getPaporFromInput, smartParseInput } from "../src/papor.js";
import { Level } from "../src/data.js";

const tests1 = (
	(d:[input:string, level:Level|null, output:string][]):[input:string, level:Level|null, outputs:string[]][] =>
		d.map(l => [l[0], l[1], l[2].split("+")]
	)
)([
	["9231_w21_qp_43", null, "9231_w21_qp_43"],
	["9231 w21 qp 43", null, "9231_w21_qp_43"],
	["__9231-w21  qp/43", null, "9231_w21_qp_43"],
	["9231_w21_43", null, "9231_w21_ms_43+9231_w21_qp_43"],
	["9231_w21_er", null, "9231_w21_er"],
	["9231_w21_gt", null, "9231_w21_gt"],
	["9701_w21_ci_31", null, "9701_w21_ci_31"],
	["fmath_w21_qp_43", null, "9231_w21_qp_43"],
	["fmath_w21_qp_43", Level.A_LEVELS, "9231_w21_qp_43"],
	["math_w21_qp_43", Level.IGCSE, "0580_w21_qp_43"],
	["math_w21_qp_43", Level.A_LEVELS, "9709_w21_qp_43"],
	["9231_o21_qp_43", null, "9231_w21_qp_43"],
	["9231_n21_qp_43", null, "9231_w21_qp_43"],
	["9231_w2021_qp_43", null, "9231_w21_qp_43"],
]);

const tests2 = (
	(d:[input:string, level:Level|null, output:string][]):[input:string, level:Level|null, outputs:string[]][] =>
		d.map(l => [l[0], l[1], l[2].split("+")]
	)
)([
	["9231_w21_qp_43", null, "9231_w21_qp_43"],
	["9231 w21 qp 43", null, "9231_w21_qp_43"],
	["__9231-w21  qp/43", null, "9231_w21_qp_43"],
	["9231_w21_43", null, "9231_w21_ms_43+9231_w21_qp_43"],
	["9231_winter_a_2021_qp_43", null, "9231_w21_qp_43"],
	["fmath_w21_qp_43", null, "9231_w21_qp_43"],
	["fmath_w21_qp_43", Level.A_LEVELS, "9231_w21_qp_43"],
	["math_w21_qp_43", Level.IGCSE, "0580_w21_qp_43"],
	["math_w21_qp_43", Level.A_LEVELS, "9709_w21_qp_43"],
	//["9231_winter_aaa_21_qp_43", null, "9231_w21_qp_43"],
	["9231_winter21_qp_43", null, "9231_w21_qp_43"],
	["9231_winter_21_qp_43", null, "9231_w21_qp_43"],
	["9231_feb 21_qp_42", null, "9231_m21_qp_42"],
	["9231 feb/mar 21_qp_43", null, "9231_m21_qp_43"],
	["fmath feb/mar 21_qp_43", null, "9231_m21_qp_43"],
	["9231 winter of the year 2021 qp_43", null, "9231_w21_qp_43"],
	["further mathematics june of 2021 qp 43", null, "9231_s21_qp_43"],
	["further mathematics october of 2021 qp 43", null, "9231_w21_qp_43"],
	["further mathematics february of 2021 qp 43", null, "9231_m21_qp_43"],
]);

describe("regular parser", () => {
	for(const [input, level, outputs] of tests1){
		it(`should parse ${input} with level ${level} to ${outputs.join("+")}`, () => {
			expect(getPaporFromInput(input, level, false).map(o => o.cleanString())).toEqual(outputs);
		});
	}
});

describe("smart parser", () => {
	for(const [input, level, outputs] of tests2){
		it(`should parse ${input} with level ${level} to ${outputs.join("+")}`, () => {
			expect(smartParseInput(input, level).map(o => o.cleanString())).toEqual(outputs);
		});
	}
});
