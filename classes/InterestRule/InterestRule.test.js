import InterestRule from "./InterestRule.js";

const logSpy = jest.spyOn(global.console, "log");

describe("InterestRule test cases", () => {
  test("getDate function", () => {
    const interestRule = new InterestRule("20231010", "rule1", 5);
    expect(interestRule.getDate()).toBe("20231010");
  });

  test("getName function", () => {
    const interestRule = new InterestRule("20231010", "rule1", 5);
    expect(interestRule.getName()).toBe("rule1");
  });

  test("getRate function", () => {
    const interestRule = new InterestRule("20231010", "rule1", 5);
    expect(interestRule.getRate()).toBe(5);
  });

  test("updateRule function", () => {
    const interestRule = new InterestRule("20231010", "rule1", 5);
    interestRule.updateRule("rule1", 3);
    expect(interestRule.getRate()).toBe(3);
  });

  test("printInterestRule function", () => {
    const interestRule = new InterestRule("20231010", "rule1", 5);
    interestRule.printInterestRule();
    expect(logSpy.mock.calls[0]).toContain("| 20231010 | rule1 | 5 |");
  });
});
