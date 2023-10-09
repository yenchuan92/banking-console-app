export default class StartMenu {
  constructor(bankInstance, readLineAsync) {
    this.bankInstance = bankInstance;
    this.readLineAsync = readLineAsync;
  }

  initialize = async (msg = "") => {
    if (this.readLineAsync) {
      const userInput = await this.readLineAsync(msg, [
        "[T] Input transactions ",
        "[I] Define interest rules ",
        "[P] Print statement ",
        "[Q] Quit ",
      ]);

      if (userInput) {
        switch (userInput.toLowerCase()) {
          case "t":
            this.bankInstance.getTransactionMenu().initialize();
            break;
          case "i":
            this.bankInstance.getInterestRuleMenu().initialize();
            break;
          case "p":
            this.bankInstance.getPrintStatementMenu().initialize();
            break;
          case "q":
            this.bankInstance.getQuitMenu().initialize();
            break;
          default:
            console.log("Please enter a valid character!");
            this.bankInstance.showStartMenu();
          // or call this.initialize again
        }
      } else {
        this.bankInstance.showStartMenu();
      }
    }
  };
}
