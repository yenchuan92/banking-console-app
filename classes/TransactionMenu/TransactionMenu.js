import Account from "../Account/Account.js";
import { isInvalidDate } from "../../helpers.js";

export default class TransactionMenu {
  constructor(bankInstance, readLineAsync) {
    this.bankInstance = bankInstance;
    this.readLineAsync = readLineAsync;
  }

  validateTransactionData = (userRes) => {
    const accounts = this.bankInstance.getAccounts();
    const data = userRes.split(" ");
    if (data.length !== 4) {
      return false;
    }
    if (isInvalidDate(data[0], "YYYYMMDD")) {
      // invalid date
      console.log("Invalid Date format, please try again!");
      return false;
    } else if (data[2].toLowerCase() !== "d" && data[2].toLowerCase() !== "w") {
      // invalid type
      console.log("Invalid Type format, please try again!");
      return false;
    } else if (
      parseFloat(data[3]) <= 0 ||
      (data[3].includes(".") && data[3].split(".")[1].length > 2)
    ) {
      // more than 2 decimal places or 0 or negative number
      console.log("Invalid Amount, please try again!");
      return false;
    } else if (data[2].toLowerCase() === "w") {
      // withdrawal
      const targetAccount = accounts.filter((acc) => {
        return acc.getName() === data[1];
      })[0];
      if (
        targetAccount &&
        targetAccount.getAccountTransactions().length > 0 &&
        targetAccount.getLatestAccountTransaction().getBalance() <
          parseFloat(data[3])
      ) {
        // balance will become negative
        return false;
      } else if (
        !targetAccount ||
        targetAccount.getAccountTransactions().length === 0
      ) {
        // no previous transactions, can't do a withdrawal!
        return false;
      }
    }
    return true;
  };

  initialize = async (msg = "") => {
    const userRes = await this.readLineAsync(msg, [
      "Please enter transaction details in <Date> <Account> <Type> <Amount> format ",
      "(or enter blank to go back to main menu):",
    ]);
    if (userRes) {
      const validationResult = this.validateTransactionData(userRes);
      if (validationResult) {
        this.handleTransaction(userRes);
        return this.bankInstance.showStartMenu();
      } else {
        console.log("Invalid transaction, please try again!");
        return this.bankInstance.showStartMenu();
      }
    } else {
      console.log("");
      return this.bankInstance.showStartMenu();
    }
  };

  handleTransaction = (res) => {
    const data = res.split(" ");
    const currentAccounts = this.bankInstance.getAccounts();
    if (currentAccounts.filter((acc) => acc.getName() === data[1]).length > 0) {
      // there are existing transactions
      // find the existing Account instance and call addTransaction on it
      const targetAccount = currentAccounts.filter((acc) => {
        return acc.getName() === data[1];
      })[0];
      targetAccount.addTransaction(data[0], data[2], data[3]);
    } else {
      // create a new Account instance
      // add it to the bank instance
      const accountInstance = new Account(data[1], this.bankInstance);
      this.bankInstance.addAccount(accountInstance);
      // call addtransaction on the new Account instance
      accountInstance.addTransaction(data[0], data[2], data[3]);
    }
  };
}
