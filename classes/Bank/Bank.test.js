import Bank from "./Bank.js";

import StartMenu from "../StartMenu/StartMenu.js";
import InterestRuleMenu from "../InterestRuleMenu/InterestRuleMenu.js";
import TransactionMenu from "../TransactionMenu/TransactionMenu.js";
import PrintStatementMenu from "../PrintStatementMenu/PrintStatementMenu.js";
import QuitMenu from "../QuitMenu/QuitMenu.js";

import Account from "../Account/Account.js";
import InterestRule from "../InterestRule/InterestRule.js";

// const logSpy = jest.spyOn(global.console, "log");

// beforeEach(() => {
//   // reset the array to empty
//   logSpy.mock.calls = [];
// });

//   afterEach(() => {
//     process.stdin.emit("data", "\n");
//     // goes back to main menu
//   });

describe("Bank test cases", () => {
  test("test setMenus and test getter functions for menus", () => {
    const bankInstance = new Bank("Test");

    const startMenu = new StartMenu(bankInstance, jest.fn());
    const transactionMenu = new TransactionMenu(bankInstance, jest.fn());
    const interestRuleMenu = new InterestRuleMenu(bankInstance, jest.fn());
    const printStatementMenu = new PrintStatementMenu(bankInstance, jest.fn());
    const quitMenu = new QuitMenu(bankInstance, jest.fn());

    bankInstance.setMenus(
      startMenu,
      transactionMenu,
      interestRuleMenu,
      printStatementMenu,
      quitMenu
    );

    expect(bankInstance.getTransactionMenu()).toBe(transactionMenu);
    expect(bankInstance.getInterestRuleMenu()).toBe(interestRuleMenu);
    expect(bankInstance.getPrintStatementMenu()).toBe(printStatementMenu);
    expect(bankInstance.getQuitMenu()).toBe(quitMenu);
  });

  test("test getName function", () => {
    const bankInstance = new Bank("Test");
    expect(bankInstance.getName()).toBe("Test");
  });

  test("test getAccounts function with no accounts", () => {
    const bankInstance = new Bank("Test");
    expect(bankInstance.getAccounts()).toStrictEqual([]);
  });

  test("test getAccounts function with accounts", () => {
    const newAcc = new Account("test");
    const bankInstance = new Bank("Test", [newAcc]);
    expect(bankInstance.getAccounts()).toStrictEqual([newAcc]);
  });

  test("test getAccountByName function with no accounts", () => {
    const bankInstance = new Bank("Test");
    expect(bankInstance.getAccountByName("test")).toBe(null);
  });

  test("test getAccountByName function with accounts", () => {
    const newAcc = new Account("test");
    const bankInstance = new Bank("Test", [newAcc]);
    expect(bankInstance.getAccountByName("test")).toStrictEqual(newAcc);
  });

  test("test addAccount function", () => {
    const bankInstance = new Bank("Test");
    const newAcc = new Account("test");
    expect(bankInstance.getAccounts()).toStrictEqual([]);
    bankInstance.addAccount(newAcc);
    expect(bankInstance.getAccounts()).toStrictEqual([newAcc]);
  });

  test("test getInterestRules function with no rules", () => {
    const bankInstance = new Bank("Test");
    expect(bankInstance.getInterestRules()).toStrictEqual([]);
  });

  test("test getInterestRules function with rules", () => {
    const newInterestRule = new InterestRule("20231010", "test rule", 5);
    const bankInstance = new Bank("Test", undefined, [newInterestRule]);
    expect(bankInstance.getInterestRules()).toStrictEqual([newInterestRule]);
  });

  test("test getInterestRules function with no rules", () => {
    const newInterestRule = new InterestRule("20231010", "test rule", 5);
    const bankInstance = new Bank("Test");
    expect(bankInstance.getInterestRules()).toStrictEqual([]);
    bankInstance.addInterestRule(newInterestRule);
    expect(bankInstance.getInterestRules()).toStrictEqual([newInterestRule]);
  });
});
