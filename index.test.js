import {
  validateTransactionData,
  validateInterestData,
  validatePrintStatementData,
  isInvalidDate,
  calculateInterest,
  startMenu,
  //   transactionsMenu,
  //   interestMenu,
  //   printMenu,
  //   quitMenu,
} from "./index";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

afterEach(() => {
  process.stdin.emit("data", "\n");
  // goes back to main menu
});

describe("test validateTransactionData", () => {
  test("test date format with invalid month", () => {
    const mockData = ["20231301", "abc", "D", "10"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test date format with invalid day", () => {
    const mockData = ["20231032", "abc", "D", "10"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test date format with valid date", () => {
    const mockData = ["20231010", "abc", "D", "10"];
    expect(validateTransactionData(mockData)).toBeTruthy();
  });

  test("test type with valid type D", () => {
    const mockData = ["20231010", "abc", "D", "10"];
    expect(validateTransactionData(mockData)).toBeTruthy();
  });

  test("test type with valid type d", () => {
    const mockData = ["20231010", "abc", "d", "10"];
    expect(validateTransactionData(mockData)).toBeTruthy();
  });

  test("test type with valid type W but no balance", () => {
    const mockData = ["20231010", "abc", "W", "10"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test type with valid type w but no balance", () => {
    const mockData = ["20231010", "abc", "w", "10"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test type with invalid type", () => {
    const mockData = ["20231010", "abc", "a", "10"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test type with invalid type", () => {
    const mockData = ["20231010", "abc", "A", "10"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test amount with valid amount without decimals", () => {
    const mockData = ["20231010", "abc", "d", "10"];
    expect(validateTransactionData(mockData)).toBeTruthy();
  });

  test("test amount with valid amount with 1 decimal", () => {
    const mockData = ["20231010", "abc", "d", "10.0"];
    expect(validateTransactionData(mockData)).toBeTruthy();
  });

  test("test amount with valid amount with 2 decimals", () => {
    const mockData = ["20231010", "abc", "d", "10.00"];
    expect(validateTransactionData(mockData)).toBeTruthy();
  });

  test("test amount with invalid amount with 3 decimals", () => {
    const mockData = ["20231010", "abc", "d", "10.000"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test amount with invalid amount with negative value", () => {
    const mockData = ["20231010", "abc", "d", "-10.00"];
    expect(validateTransactionData(mockData)).toBe(false);
  });

  test("test amount with invalid amount with value 0", () => {
    const mockData = ["20231010", "abc", "d", "0"];
    expect(validateTransactionData(mockData)).toBe(false);
  });
});

describe("test validateInterestData", () => {
  test("test date format with invalid month", () => {
    const mockData = ["20231301", "abc", "10"];
    expect(validateInterestData(mockData)).toBe(false);
  });

  test("test date format with invalid day", () => {
    const mockData = ["20231032", "abc", "10"];
    expect(validateInterestData(mockData)).toBe(false);
  });

  test("test date format with valid date", () => {
    const mockData = ["20231010", "abc", "10"];
    expect(validateInterestData(mockData)).toBeTruthy();
  });

  test("test interest rate with valid interest rate", () => {
    const mockData = ["20231010", "abc", "10"];
    expect(validateInterestData(mockData)).toBeTruthy();
  });

  test("test interest rate with invalid interest rate 101", () => {
    const mockData = ["20231010", "abc", "101"];
    expect(validateInterestData(mockData)).toBe(false);
  });

  test("test interest rate with invalid negative interest rate", () => {
    const mockData = ["20231010", "abc", "-5"];
    expect(validateInterestData(mockData)).toBe(false);
  });
});

describe("test validatePrintStatementData", () => {
  test("test date format with invalid month", () => {
    const mockData = ["abc", "202313"];
    expect(validatePrintStatementData(mockData)).toBe(false);
  });

  test("test date format with valid month but non-existent account", () => {
    const mockData = ["abc", "202310"];
    expect(validatePrintStatementData(mockData)).toBe(false);
  });
});

describe("test isInvalidDate", () => {
  test("test date format with invalid month, YYYYMMDD format", () => {
    expect(isInvalidDate("20231310", "YYYYMMDD")).toBeTruthy();
  });

  test("test date format with invalid day, YYYYMMDD format", () => {
    expect(isInvalidDate("20231032", "YYYYMMDD")).toBeTruthy();
  });

  test("test date format with valid date, YYYYMMDD format", () => {
    expect(isInvalidDate("20231010", "YYYYMMDD")).toBe(false);
  });

  test("test date format with invalid month, YYYYMM format", () => {
    expect(isInvalidDate("202313", "YYYYMM")).toBeTruthy();
  });

  test("test date format with valid date, YYYYMM format", () => {
    expect(isInvalidDate("202311", "YYYYMM")).toBe(false);
  });
});

describe("test calculateInterest", () => {
  test("test interest calculation with 1 data and 1 rule", () => {
    const mockData = [
      {
        date: "20230906",
        id: "20230906-01",
        type: "D",
        amt: 10,
        balance: 10,
      },
    ];
    const mockRules = [{ date: "20230903", id: "r1", rate: 5 }];
    // 25*0.05*10 = 12.5
    expect(calculateInterest(mockData, mockRules)).toBe(12.5);
  });

  test("test interest calculation with multiple data and 1 rule", () => {
    const mockData = [
      {
        date: "20230906",
        id: "20230906-01",
        type: "D",
        amt: 10,
        balance: 10,
      },
      {
        date: "20230920",
        id: "20230920-01",
        type: "D",
        amt: 20,
        balance: 30,
      },
    ];
    const mockRules = [{ date: "20230903", id: "r1", rate: 5 }];
    // 14*0.05*10 + 11*0.05*30 = 23.5
    expect(calculateInterest(mockData, mockRules)).toBe(23.5);
  });

  test("test interest calculation with 1 data and multiple rules", () => {
    const mockData = [
      {
        date: "20230906",
        id: "20230906-01",
        type: "D",
        amt: 10,
        balance: 10,
      },
    ];
    const mockRules = [
      { date: "20230903", id: "r1", rate: 5 },
      { date: "20230910", id: "r2", rate: 3 },
    ];
    // 4*0.05*10 + 21*0.03*10 = 8.3
    expect(calculateInterest(mockData, mockRules)).toBeCloseTo(8.3, 2);
  });

  test("test interest calculation with multiple data and multiple rules", () => {
    const mockData = [
      {
        date: "20230906",
        id: "20230906-01",
        type: "D",
        amt: 10,
        balance: 10,
      },
      {
        date: "20230920",
        id: "20230920-01",
        type: "D",
        amt: 20,
        balance: 30,
      },
    ];
    const mockRules = [
      { date: "20230903", id: "r1", rate: 5 },
      { date: "20230910", id: "r2", rate: 3 },
    ];
    // 4*0.05*10 + 10*0.03*10 + 11*0.03*30 = 14.9
    expect(calculateInterest(mockData, mockRules)).toBeCloseTo(14.9, 2);
  });
});

describe("test startMenu calls the correct menu when given an input", () => {
  test("test with input T", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "T\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain(
        "Please enter transaction details in <Date> <Account> <Type> <Amount> format "
      );
    });
  });

  test("test with input t", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "t\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain(
        "Please enter transaction details in <Date> <Account> <Type> <Amount> format "
      );
    });
  });

  test("test with input I", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "I\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain(
        "Please enter interest rules details in <Date> <RuleId> <Rate in %> format "
      );
    });
  });

  test("test with input i", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "i\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain(
        "Please enter interest rules details in <Date> <RuleId> <Rate in %> format "
      );
    });
  });

  test("test with input P", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "P\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain(
        "Please enter account and month to generate the statement <Account> <Year><Month> "
      );
    });
  });

  test("test with input p", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "p\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain(
        "Please enter account and month to generate the statement <Account> <Year><Month> "
      );
    });
  });

  test("test with input a", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "a\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain("Please enter a valid character!");
    });
  });

  test("test with input B", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "B\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain("Please enter a valid character!");
    });
  });

  test("test with input Q", () => {
    startMenu();
    expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
    expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
    expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
    expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

    const input = "Q\n";
    const inputEvent = () => process.stdin.emit("data", input);
    Promise.resolve(inputEvent()).then(() => {
      expect(logSpy.mock.calls[4]).toContain(
        "Thank you for banking with AwesomeGIC Bank."
      );
    });
  });

  // can't test quit again unless you reopen a readline interface
  //   test("test with input q", () => {
  //     startMenu();
  //     expect(logSpy).toHaveBeenCalledWith("[T] Input transactions ");
  //     expect(logSpy).toHaveBeenCalledWith("[I] Define interest rules ");
  //     expect(logSpy).toHaveBeenCalledWith("[P] Print statement ");
  //     expect(logSpy).toHaveBeenCalledWith("[Q] Quit ");

  //     const input = "q\n";
  //     const inputEvent = () => process.stdin.emit("data", input);
  //     Promise.resolve(inputEvent()).then(() => {
  //       expect(logSpy.mock.calls[4]).toContain(
  //         "Thank you for banking with AwesomeGIC Bank."
  //       );
  //     });
  //   });
});

// no need to test the other menus since the main functionality is inside the validation, which has already been tested
