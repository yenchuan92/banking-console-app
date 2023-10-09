export default class Bank {
  constructor(name, accounts, interestRules) {
    this.name = name;
    this.accounts = accounts || [];
    this.interestRules = interestRules || [];
  }

  getName = () => {
    return this.name;
  };

  getAccounts = () => {
    return this.accounts;
  };

  getAccountByName = (name) => {
    const target = this.accounts.filter((acc) => {
      return acc.getName() === name;
    });
    if (target.length === 1) {
      return target[0];
    } else {
      return null;
    }
  };

  addAccount = (account) => {
    return this.accounts.push(account);
  };

  getInterestRules = () => {
    return this.interestRules;
  };

  addInterestRule = (rule) => {
    return this.interestRules.push(rule);
  };

  showStartMenu = () => {
    return this.startMenu.initialize(
      "Welcome to " + this.name + " Bank! What would you like to do?"
    );
  };

  getTransactionMenu = () => {
    return this.transactionMenu;
  };

  getInterestRuleMenu = () => {
    return this.interestRuleMenu;
  };

  getPrintStatementMenu = () => {
    return this.printStatementMenu;
  };

  getQuitMenu = () => {
    return this.quitMenu;
  };

  setMenus = (
    startMenu,
    transactionMenu,
    interestRuleMenu,
    printStatementMenu,
    quitMenu
  ) => {
    this.startMenu = startMenu;
    this.transactionMenu = transactionMenu;
    this.interestRuleMenu = interestRuleMenu;
    this.printStatementMenu = printStatementMenu;
    this.quitMenu = quitMenu;
  };
}
