import { createInterface } from "readline";

import Bank from "./classes/Bank/Bank.js";
import StartMenu from "./classes/StartMenu/StartMenu.js";
import InterestRuleMenu from "./classes/InterestRuleMenu/InterestRuleMenu.js";
import TransactionMenu from "./classes/TransactionMenu/TransactionMenu.js";
import PrintStatementMenu from "./classes/PrintStatementMenu/PrintStatementMenu.js";
import QuitMenu from "./classes/QuitMenu/QuitMenu.js";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readLineAsync = (startMsg, msgs) => {
  if (startMsg) {
    console.log(startMsg);
  }
  msgs.map((msg) => {
    console.log(msg);
  });
  return new Promise((resolve) => {
    readline.question(">", (userRes) => {
      resolve(userRes);
    });
  });
};

const bankInstance = new Bank("AwesomeGIC");

const startMenu = new StartMenu(bankInstance, readLineAsync);
const transactionMenu = new TransactionMenu(bankInstance, readLineAsync);
const interestRuleMenu = new InterestRuleMenu(bankInstance, readLineAsync);
const printStatementMenu = new PrintStatementMenu(bankInstance, readLineAsync);
const quitMenu = new QuitMenu(bankInstance, readline);

bankInstance.setMenus(
  startMenu,
  transactionMenu,
  interestRuleMenu,
  printStatementMenu,
  quitMenu
);

bankInstance.showStartMenu();
