import Account from "./Account.js";
import Transaction from "../Transaction/Transaction.js";

import Bank from "../Bank/Bank.js";
import StartMenu from "../StartMenu/StartMenu.js";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

describe("Account test cases", () => {
  test("test getName function", () => {
    const accInstance = new Account("Test");
    expect(accInstance.getName()).toBe("Test");
  });

  test("test getAccountTransactions function with no transactions", () => {
    const accInstance = new Account("Test");
    expect(accInstance.getAccountTransactions()).toStrictEqual([]);
  });

  test("test getAccountTransactions function with transactions", () => {
    const newTransaction = new Transaction(
      "20231010",
      "20231010-01",
      "D",
      10,
      10
    );
    const accInstance = new Account("Test", undefined, [newTransaction]);
    expect(accInstance.getAccountTransactions()).toStrictEqual([
      newTransaction,
    ]);
  });

  test("test getLatestAccountTransaction function with transactions", () => {
    const newTransaction = new Transaction(
      "20231010",
      "20231010-01",
      "D",
      10,
      10
    );
    const newTransaction2 = new Transaction(
      "20231010",
      "20231010-02",
      "D",
      10,
      20
    );
    const accInstance = new Account("Test", undefined, [
      newTransaction,
      newTransaction2,
    ]);
    expect(accInstance.getLatestAccountTransaction()).toStrictEqual(
      newTransaction2
    );
  });

  test("test addTransaction function with no existing transactions", () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn(() => Promise.resolve(null))
    );
    bankInstance.setMenus(startMenu);
    const accInstance = new Account("Test", bankInstance);
    expect(accInstance.getAccountTransactions()).toStrictEqual([]);
    accInstance.addTransaction("20231010", "d", 10);
    expect(accInstance.getAccountTransactions().length).toBe(1);
  });

  test("test addTransaction function with existing same day transactions, deposit", () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn(() => Promise.resolve(null))
    );
    bankInstance.setMenus(startMenu);
    const newTransaction = new Transaction(
      "20231010",
      "20231010-01",
      "D",
      10,
      10
    );
    const accInstance = new Account("Test", bankInstance, [newTransaction]);
    expect(accInstance.getAccountTransactions()).toStrictEqual([
      newTransaction,
    ]);
    accInstance.addTransaction("20231010", "d", 20);
    expect(accInstance.getAccountTransactions().length).toBe(2);
    expect(accInstance.getAccountTransactions()[1].getIdLastTwoDigits()).toBe(
      "02"
    );
    expect(accInstance.getAccountTransactions()[1].getBalance()).toBe(30);
  });

  test("test addTransaction function with existing same day transactions, valid withdrawal", () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn(() => Promise.resolve(null))
    );
    bankInstance.setMenus(startMenu);
    const newTransaction = new Transaction(
      "20231010",
      "20231010-01",
      "D",
      10,
      10
    );
    const accInstance = new Account("Test", bankInstance, [newTransaction]);
    expect(accInstance.getAccountTransactions()).toStrictEqual([
      newTransaction,
    ]);
    accInstance.addTransaction("20231010", "w", 5);
    expect(accInstance.getAccountTransactions().length).toBe(2);
    expect(accInstance.getAccountTransactions()[1].getIdLastTwoDigits()).toBe(
      "02"
    );
    expect(accInstance.getAccountTransactions()[1].getBalance()).toBe(5);
  });

  test("test addTransaction function with existing other day transactions, deposit", () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn(() => Promise.resolve(null))
    );
    bankInstance.setMenus(startMenu);
    const newTransaction = new Transaction(
      "20231010",
      "20231010-01",
      "D",
      10,
      10
    );
    const accInstance = new Account("Test", bankInstance, [newTransaction]);
    expect(accInstance.getAccountTransactions()).toStrictEqual([
      newTransaction,
    ]);
    accInstance.addTransaction("20231011", "d", 20);
    expect(accInstance.getAccountTransactions().length).toBe(2);
    expect(accInstance.getAccountTransactions()[1].getIdLastTwoDigits()).toBe(
      "01"
    );
    expect(accInstance.getAccountTransactions()[1].getBalance()).toBe(30);
  });

  test("test addTransaction function with existing other day transactions, valid withdrawal", () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn(() => Promise.resolve(null))
    );
    bankInstance.setMenus(startMenu);
    const newTransaction = new Transaction(
      "20231010",
      "20231010-01",
      "D",
      10,
      10
    );
    const accInstance = new Account("Test", bankInstance, [newTransaction]);
    expect(accInstance.getAccountTransactions()).toStrictEqual([
      newTransaction,
    ]);
    accInstance.addTransaction("20231011", "w", 5);
    expect(accInstance.getAccountTransactions().length).toBe(2);
    expect(accInstance.getAccountTransactions()[1].getIdLastTwoDigits()).toBe(
      "01"
    );
    expect(accInstance.getAccountTransactions()[1].getBalance()).toBe(5);
  });

  test("test printTransaction function with no transactions", () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn(() => Promise.resolve(null))
    );
    bankInstance.setMenus(startMenu);
    const accInstance = new Account("Test", bankInstance);
    accInstance.printTransactionData();
    expect(logSpy.mock.calls[0]).toContain("Account: Test");
    expect(logSpy.mock.calls[1]).toContain(
      "| Date     | Txn Id      | Type | Amount |"
    );
  });

  test("test printTransaction function with transactions", () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn(() => Promise.resolve(null))
    );
    bankInstance.setMenus(startMenu);
    const newTransaction = new Transaction(
      "20231010",
      "20231010-01",
      "D",
      10,
      10
    );
    const accInstance = new Account("Test", bankInstance, [newTransaction]);
    accInstance.printTransactionData();
    expect(logSpy.mock.calls[0]).toContain("Account: Test");
    expect(logSpy.mock.calls[1]).toContain(
      "| Date     | Txn Id      | Type | Amount |"
    );
    expect(logSpy.mock.calls[2][0]).toContain(
      "| 20231010 | 20231010-01 |  D  | 10 |"
    );
  });
});
