import InterestRuleMenu from "./InterestRuleMenu.js";
import Bank from "../Bank/Bank.js";
import StartMenu from "../StartMenu/StartMenu.js";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

// afterEach(() => {
//   jest.resetAllMocks();
// });

describe("InterestRuleMenu tests", () => {
  test("test initialize method with no existing rules", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const interestRuleMenu = new InterestRuleMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, null, interestRuleMenu);

    await interestRuleMenu.initialize("20231010 rule1 5");
    expect(bankInstance.getInterestRules().length).toBe(1);
    expect(bankInstance.getInterestRules()[0].getName()).toBe("rule1");
    expect(bankInstance.getInterestRules()[0].getDate()).toBe("20231010");
    expect(bankInstance.getInterestRules()[0].getRate()).toBe(
      parseFloat(parseFloat(5).toFixed(2))
    );
  });

  test("test initialize method with existing rules on same day", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const interestRuleMenu = new InterestRuleMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, interestRuleMenu);

    await interestRuleMenu.initialize("20231010 rule1 5");
    await interestRuleMenu.initialize("20231010 rule2 3");
    expect(bankInstance.getInterestRules().length).toBe(1);
    expect(bankInstance.getInterestRules()[0].getName()).toBe("rule2");
    expect(bankInstance.getInterestRules()[0].getDate()).toBe("20231010");
    expect(bankInstance.getInterestRules()[0].getRate()).toBe(
      parseFloat(parseFloat(3).toFixed(2))
    );
  });

  test("test initialize method with existing rules on different day", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const interestRuleMenu = new InterestRuleMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, interestRuleMenu);

    await interestRuleMenu.initialize("20231010 rule1 5");
    await interestRuleMenu.initialize("20231011 rule2 3");
    expect(bankInstance.getInterestRules().length).toBe(2);
    expect(bankInstance.getInterestRules()[0].getName()).toBe("rule1");
    expect(bankInstance.getInterestRules()[0].getDate()).toBe("20231010");
    expect(bankInstance.getInterestRules()[0].getRate()).toBe(
      parseFloat(parseFloat(5).toFixed(2))
    );
    expect(bankInstance.getInterestRules()[1].getName()).toBe("rule2");
    expect(bankInstance.getInterestRules()[1].getDate()).toBe("20231011");
    expect(bankInstance.getInterestRules()[1].getRate()).toBe(
      parseFloat(parseFloat(3).toFixed(2))
    );
  });

  test("test validateInterestData method", async () => {
    const bankInstance = new Bank("Test");
    const interestRuleMenu = new InterestRuleMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );

    expect(
      interestRuleMenu.validateInterestData("20231010", "rule1", "5")
    ).toBe(true);
    expect(
      interestRuleMenu.validateInterestData("20231032", "rule1", "5")
    ).toBe(false);
    expect(
      interestRuleMenu.validateInterestData("20231310", "rule1", "5")
    ).toBe(false);
    expect(
      interestRuleMenu.validateInterestData("20231010", "rule1", "test")
    ).toBe(false);
    expect(
      interestRuleMenu.validateInterestData("20231010", "rule1", "100.1")
    ).toBe(false);
    expect(
      interestRuleMenu.validateInterestData("20231010", "rule1", "101")
    ).toBe(false);
    expect(
      interestRuleMenu.validateInterestData("20231010", "rule1", "-1")
    ).toBe(false);
  });

  test("test printInterestRuleData method with no existing rules", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const interestRuleMenu = new InterestRuleMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, interestRuleMenu);

    interestRuleMenu.printInterestRuleData();

    expect(logSpy.mock.calls[0]).toContain("Interest rules: ");
    expect(logSpy.mock.calls[1]).toContain("| Date     | RuleId | Rate |");
    expect(logSpy.mock.calls[2]).toContain("");
  });

  test("test printInterestRuleData method with existing rules", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const interestRuleMenu = new InterestRuleMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, interestRuleMenu);

    await interestRuleMenu.initialize("20231010 rule1 5");
    interestRuleMenu.printInterestRuleData();

    expect(logSpy.mock.calls[0]).toContain("Interest rules: ");
    expect(logSpy.mock.calls[1]).toContain("| Date     | RuleId | Rate |");
    expect(logSpy.mock.calls[2]).toContain("| 20231010 | rule1 | 5 |");
    expect(logSpy.mock.calls[3]).toContain("");
  });
});
