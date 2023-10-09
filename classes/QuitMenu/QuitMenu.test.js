import QuitMenu from "./QuitMenu.js";
import Bank from "../Bank/Bank.js";

const logSpy = jest.spyOn(global.console, "log");

beforeEach(() => {
  // reset the array to empty
  logSpy.mock.calls = [];
});

describe("QuitMenu tests", () => {
  test("test initialize method with no existing rules or no transactions, no matching account", async () => {
    const bankInstance = new Bank("Test");
    const mockClose = jest.fn();
    const mockReadLine = { close: mockClose };
    const quitMenu = new QuitMenu(bankInstance, mockReadLine);

    quitMenu.initialize();
    expect(logSpy.mock.calls[0]).toContain(
      "Thank you for banking with Test Bank."
    );
    expect(logSpy.mock.calls[1]).toContain("Have a nice day!");
    expect(mockClose).toHaveBeenCalled();
  });
});
