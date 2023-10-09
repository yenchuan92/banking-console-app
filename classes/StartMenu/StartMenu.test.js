import StartMenu from "./StartMenu.js";

import Bank from "../Bank/Bank.js";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

describe("test StartMenu", () => {
  test("invalid option letter", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockStartMenu = { initialize: () => jest.fn() };
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();
    bankInstance.setMenus(
      mockStartMenu,
      mockTransactionMenu,
      mockInterestRuleMenu,
      mockPrintStatementMenu,
      mockQuitMenu
    );

    await startMenu.initialize("a");
    expect(logSpy.mock.calls[0]).toContain("Please enter a valid character!");
  });

  test("invalid option digit", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockStartMenu = { initialize: () => jest.fn() };
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();
    bankInstance.setMenus(
      mockStartMenu,
      mockTransactionMenu,
      mockInterestRuleMenu,
      mockPrintStatementMenu,
      mockQuitMenu
    );

    await startMenu.initialize("123");
    expect(logSpy.mock.calls[0]).toContain("Please enter a valid character!");
  });

  test("valid option t", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("t");
    expect(mockTransactionMenu).toHaveBeenCalled();
  });

  test("valid option T", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("T");
    expect(mockTransactionMenu).toHaveBeenCalled();
  });

  test("valid option i", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("i");
    expect(mockInterestRuleMenu).toHaveBeenCalled();
  });

  test("valid option I", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("I");
    expect(mockInterestRuleMenu).toHaveBeenCalled();
  });

  test("valid option p", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("p");
    expect(mockPrintStatementMenu).toHaveBeenCalled();
  });

  test("valid option P", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("P");
    expect(mockPrintStatementMenu).toHaveBeenCalled();
  });

  test("valid option q", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("q");
    expect(mockQuitMenu).toHaveBeenCalled();
  });

  test("valid option Q", async () => {
    const bankInstance = new Bank("Test");
    const startMenu = new StartMenu(
      bankInstance,
      jest.fn((msg) => Promise.resolve(msg))
    );
    const mockTransactionMenu = jest.fn();
    const mockInterestRuleMenu = jest.fn();
    const mockPrintStatementMenu = jest.fn();
    const mockQuitMenu = jest.fn();

    bankInstance.setMenus(
      startMenu,
      { initialize: () => mockTransactionMenu() },
      { initialize: () => mockInterestRuleMenu() },
      { initialize: () => mockPrintStatementMenu() },
      { initialize: () => mockQuitMenu() }
    );

    await startMenu.initialize("Q");
    expect(mockQuitMenu).toHaveBeenCalled();
  });
});
