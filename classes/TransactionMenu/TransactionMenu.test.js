import TransactionMenu from "./TransactionMenu.js";
import Bank from "../Bank/Bank.js";
import StartMenu from "../StartMenu/StartMenu.js";
import Account from "../Account/Account.js";
import Transaction from "../Transaction/Transaction.js";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

describe("test TransactionMenu", () => {
  test("test validateTransactionData without existing account", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    expect(transactionMenu.validateTransactionData("20231010 test d 10")).toBe(
      true
    );

    expect(transactionMenu.validateTransactionData("20231310 test d 10")).toBe(
      false
    );

    expect(transactionMenu.validateTransactionData("20231032 test d 10")).toBe(
      false
    );

    expect(transactionMenu.validateTransactionData("20231010 test a 10")).toBe(
      false
    );

    expect(transactionMenu.validateTransactionData("20231010 test w 10")).toBe(
      false
    );
  });

  test("test validateTransactionData with existing account, withdraw till 0", async () => {
    const bankInstance = new Bank("Test", [
      new Account("test", null, [
        new Transaction("20231010", "20231010-01", "D", 10, 10),
      ]),
    ]);
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    expect(transactionMenu.validateTransactionData("20231010 test w 10")).toBe(
      true
    );
  });

  test("test validateTransactionData with existing account, withdraw till negative", async () => {
    const bankInstance = new Bank("Test", [
      new Account("test", null, [
        new Transaction("20231010", "20231010-01", "D", 10, 10),
      ]),
    ]);
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    expect(transactionMenu.validateTransactionData("20231010 test w 11")).toBe(
      false
    );
  });

  test("test validateTransactionData with existing account, withdraw and still positive balance", async () => {
    const bankInstance = new Bank("Test", [
      new Account("test", null, [
        new Transaction("20231010", "20231010-01", "D", 10, 10),
      ]),
    ]);
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    expect(transactionMenu.validateTransactionData("20231010 test w 5")).toBe(
      true
    );
  });

  test("test initialize with invalid input", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    await transactionMenu.initialize("20231010 test a 10");
    expect(logSpy.mock.calls[1]).toContain(
      "Invalid transaction, please try again!"
    );
  });

  test("test initialize with valid input", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    await transactionMenu.initialize("20231010 test d 10");
    expect(logSpy.mock.calls[0]).toContain("Account: test");
  });

  test("test handleTransaction with no accounts", () => {
    const bankInstance = new Bank("Test");
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    transactionMenu.handleTransaction("20231010 test d 10");
    expect(bankInstance.getAccounts().length).toBe(1);
    expect(bankInstance.getAccounts()[0].getName()).toBe("test");
  });

  test("test handleTransaction with existing accounts", () => {
    const bankInstance = new Bank("Test", [
      new Account("test", null, [
        new Transaction("20231010", "20231010-01", "D", 10, 10),
      ]),
    ]);
    const startMenu = { initialize: () => jest.fn() };
    const transactionMenu = new TransactionMenu(
      bankInstance,
      jest.fn((data) => Promise.resolve(data))
    );
    bankInstance.setMenus(startMenu, transactionMenu);

    transactionMenu.handleTransaction("20231010 test d 10");
    expect(bankInstance.getAccounts().length).toBe(1);
    expect(bankInstance.getAccounts()[0].getName()).toBe("test");
    expect(
      bankInstance.getAccounts()[0].getLatestAccountTransaction().getBalance()
    ).toBe(20);
  });
});
