import PrintStatementMenu from "./PrintStatementMenu.js";
import Bank from "../Bank/Bank.js";
import StartMenu from "../StartMenu/StartMenu.js";
import Account from "../Account/Account.js";
import InterestRule from "../InterestRule/InterestRule.js";
import Transaction from "../Transaction/Transaction.js";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

describe("PrintStatementMenu tests", () => {
  test("test initialize method with no existing rules or no transactions, no matching account", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, null, null, printStatementMenu);
    await printStatementMenu.initialize("test 202310");
    expect(logSpy.mock.calls[0]).toContain(
      "Account not found, please try again!"
    );
  });
  test("test initialize method with no existing rules or no transactions, has matching account", async () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const startMenu = { initialize: () => jest.fn() };
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, null, null, printStatementMenu);
    await printStatementMenu.initialize("test 202310");
    expect(logSpy.mock.calls[0]).toContain("Account: test");
    expect(logSpy.mock.calls[1]).toContain(
      "| Date     | Txn Id      | Type | Amount | Balance |"
    );
    expect(logSpy.mock.calls[2]).toContain("");
  });
  test("test initialize method with existing rules and transactions", async () => {
    const bankInstance = new Bank(
      "Test",
      [
        new Account("test", null, [
          new Transaction("20231010", "20231010-01", "D", 10, 10),
        ]),
      ],
      [new InterestRule("20231003", "rule1", "3")]
    );
    const startMenu = { initialize: () => jest.fn() };
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, null, null, printStatementMenu);
    await printStatementMenu.initialize("test 202310");
    expect(logSpy.mock.calls[0]).toContain("Account: test");
    expect(logSpy.mock.calls[1]).toContain(
      "| Date     | Txn Id      | Type | Amount | Balance |"
    );
    expect(logSpy.mock.calls[2]).toContain(
      "| 20231010 | 20231010-01 | D | 10 | 10 | "
    );
    expect(logSpy.mock.calls[3]).toContain(
      "| 20231031 |           | I | 0.02 | 10.02 | "
    );
  });
  test("test validatePrintStatementData method", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    expect(
      printStatementMenu.validatePrintStatementData("test", "202310")
    ).toBe(true);
    expect(
      printStatementMenu.validatePrintStatementData("test", "202313")
    ).toBe(false);
    expect(printStatementMenu.validatePrintStatementData("a", "202310")).toBe(
      false
    );
  });
  test("test calculateInterest method with 1 transaction and 1 rule", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    const mockData = [new Transaction("20230906", "20230906-01", "D", 10, 10)];
    const mockRules = [new InterestRule("20230903", "r1", 5)];
    // 25*0.05*10 = 12.5
    expect(printStatementMenu.calculateInterest(mockData, mockRules)).toBe(
      12.5
    );
  });
  test("test calculateInterest method with 2 transactions and 1 rule", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    const mockData = [
      new Transaction("20230906", "20230906-01", "D", 10, 10),
      new Transaction("20230920", "20230920-01", "D", 20, 30),
    ];
    const mockRules = [new InterestRule("20230903", "r1", 5)];
    // 14*0.05*10 + 11*0.05*30 = 23.5
    expect(printStatementMenu.calculateInterest(mockData, mockRules)).toBe(
      23.5
    );
  });
  test("test calculateInterest method with 1 transaction and 2 rules", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    const mockData = [new Transaction("20230906", "20230906-01", "D", 10, 10)];
    const mockRules = [
      new InterestRule("20230903", "r1", 5),
      new InterestRule("20230910", "r2", 3),
    ];
    // 4*0.05*10 + 21*0.03*10 = 8.3
    expect(
      printStatementMenu.calculateInterest(mockData, mockRules)
    ).toBeCloseTo(8.3, 2);
  });
  test("test calculateInterest method with 2 transactions and 2 rules", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    const mockData = [
      new Transaction("20230906", "20230906-01", "D", 10, 10),
      new Transaction("20230920", "20230920-01", "D", 20, 30),
    ];
    const mockRules = [
      new InterestRule("20230903", "r1", 5),
      new InterestRule("20230910", "r2", 3),
    ];
    // 4*0.05*10 + 10*0.03*10 + 11*0.03*30 = 14.9
    expect(
      printStatementMenu.calculateInterest(mockData, mockRules)
    ).toBeCloseTo(14.9, 2);
  });
  test("test printStatementData method with no transaction data", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    printStatementMenu.printStatementData("test", []);
    expect(logSpy.mock.calls[0]).toContain("Account: test");
    expect(logSpy.mock.calls[1]).toContain(
      "| Date     | Txn Id      | Type | Amount | Balance |"
    );
    expect(logSpy.mock.calls[2]).toBeFalsy();
  });
  test("test printStatementData method with 1 transaction data", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    printStatementMenu.printStatementData("test", [
      new Transaction("20230906", "20230906-01", "D", 10, 10),
    ]);
    expect(logSpy.mock.calls[0]).toContain("Account: test");
    expect(logSpy.mock.calls[1]).toContain(
      "| Date     | Txn Id      | Type | Amount | Balance |"
    );
    expect(logSpy.mock.calls[2]).toContain(
      "| 20230906 | 20230906-01 | D | 10 | 10 | "
    );
    expect(logSpy.mock.calls[3]).toBeFalsy();
  });
  test("test printStatementData method with 2 transaction data", () => {
    const bankInstance = new Bank("Test", [new Account("test", null, [])]);
    const printStatementMenu = new PrintStatementMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    printStatementMenu.printStatementData("test", [
      new Transaction("20230906", "20230906-01", "D", 10, 10),
      new Transaction("20230907", "20230907-01", "D", 10, 20),
    ]);
    expect(logSpy.mock.calls[0]).toContain("Account: test");
    expect(logSpy.mock.calls[1]).toContain(
      "| Date     | Txn Id      | Type | Amount | Balance |"
    );
    expect(logSpy.mock.calls[2]).toContain(
      "| 20230906 | 20230906-01 | D | 10 | 10 | "
    );
    expect(logSpy.mock.calls[3]).toContain(
      "| 20230907 | 20230907-01 | D | 10 | 20 | "
    );
    expect(logSpy.mock.calls[4]).toBeFalsy();
  });
});
