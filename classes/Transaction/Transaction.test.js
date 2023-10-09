import Transaction from "./Transaction.js";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

describe("test Transaction methods", () => {
  test("getDate method", () => {
    const transaction = new Transaction("20231010", "20231010-01", "D", 10, 20);
    expect(transaction.getDate()).toBe("20231010");
  });

  test("getIdLastTwoDigits method", () => {
    const transaction = new Transaction("20231010", "20231010-01", "D", 10, 20);
    expect(transaction.getIdLastTwoDigits()).toBe("01");
  });

  test("getBalance method", () => {
    const transaction = new Transaction("20231010", "20231010-01", "D", 10, 20);
    expect(transaction.getBalance()).toBe(20);
  });

  test("printTransaction method", () => {
    const transaction = new Transaction("20231010", "20231010-01", "D", 10, 20);
    transaction.printTransaction();
    expect(logSpy.mock.calls[0]).toContain(
      "| 20231010 | 20231010-01 |  D  | 10 |"
    );
  });

  test("printStatementTransaction method", () => {
    const transaction = new Transaction("20231010", "20231010-01", "D", 10, 20);
    transaction.printStatementTransaction();
    expect(logSpy.mock.calls[0]).toContain(
      "| 20231010 | 20231010-01 | D | 10 | 20 | "
    );
  });
});
