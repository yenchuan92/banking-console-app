import Transaction from "../Transaction/Transaction.js";
import { isInvalidDate } from "../../helpers.js";
import moment from "moment";

export default class PrintStatementMenu {
  constructor(bankInstance, readLineAsync) {
    this.bankInstance = bankInstance;
    this.readLineAsync = readLineAsync;
  }

  initialize = async (msg = "") => {
    const userRes = await this.readLineAsync(msg, [
      "Please enter account and month to generate the statement <Account> <Year><Month> ",
      "(or enter blank to go back to main menu):",
    ]);

    if (userRes) {
      const data = userRes.split(" ");
      if (
        data.length === 2 &&
        this.validatePrintStatementData(data[0], data[1])
      ) {
        let calculatedInterest;
        // get the transactions in the target month
        const sameMonthTransactions = this.bankInstance
          .getAccountByName(data[0])
          .getAccountTransactions()
          .filter((tx) => {
            return (
              moment(tx.getDate(), "YYYYMMDD").month() ===
                moment(data[1], "YYYYMM").month() &&
              moment(tx.getDate(), "YYYYMMDD").year() ===
                moment(data[1], "YYYYMM").year()
            );
          });
        // get the interest rules in the target month
        const sameMonthInterestRules = this.bankInstance
          .getInterestRules()
          .filter((rule) => {
            return (
              moment(rule.getDate(), "YYYYMMDD").month() ===
                moment(data[1], "YYYYMM").month() &&
              moment(rule.getDate(), "YYYYMMDD").year() ===
                moment(data[1], "YYYYMM").year()
            );
          });

        // generate the interest calculation and append to transaction list based on current month
        if (
          sameMonthInterestRules.length > 0 &&
          sameMonthTransactions.length > 0
        ) {
          calculatedInterest =
            this.calculateInterest(
              sameMonthTransactions,
              sameMonthInterestRules
            ) / 365;
          const newDate =
            moment(data[1], "YYYYMM").year().toString() +
            (moment(data[1], "YYYYMM").month() + 1).toString() +
            moment(data[1], "YYYYMM").daysInMonth().toString();
          const newAmount = parseFloat(
            parseFloat(calculatedInterest).toFixed(2)
          );
          const newBalance =
            sameMonthTransactions[
              sameMonthTransactions.length - 1
            ].getBalance() +
            parseFloat(parseFloat(calculatedInterest).toFixed(2));
          sameMonthTransactions.push(
            new Transaction(newDate, "         ", "I", newAmount, newBalance)
          );
        }
        // if there is no transaction and/or no interest rule for that month, no need to calculate the interest!
        this.printStatementData(data[0], sameMonthTransactions);
        console.log("");
        return this.bankInstance.showStartMenu();
      } else {
        console.log("Invalid input format, please try again!");
        return this.bankInstance.showStartMenu();
      }
    } else {
      console.log("");
      return this.bankInstance.showStartMenu();
    }
  };

  validatePrintStatementData = (accName, date) => {
    if (isInvalidDate(date, "YYYYMM")) {
      // invalid date
      console.log("Invalid Date format, please try again!");
      return false;
    } else if (!this.bankInstance.getAccountByName(accName)) {
      // non existent account
      console.log("Account not found, please try again!");
      return false;
    }
    return true;
  };

  calculateInterest = (txs, rules) => {
    // txs, rules
    const totalDays = moment(txs[0].getDate(), "YYYYMMDD").daysInMonth();
    let totalInterest = 0;
    let txIndex = 0;
    let rateIndex = 0;
    for (let i = 1; i < totalDays + 1; i++) {
      // loop through all the days in the month and then add them all up
      const currentTxDay = moment(txs[txIndex].getDate(), "YYYYMMDD").date();
      const nextTxDay = txs[txIndex + 1]
        ? moment(txs[txIndex + 1].getDate(), "YYYYMMDD").date()
        : undefined;
      const currentRateDay = moment(
        rules[rateIndex].getDate(),
        "YYYYMMDD"
      ).date();
      const nextRateDay = rules[rateIndex + 1]
        ? moment(rules[rateIndex + 1].getDate(), "YYYYMMDD").date()
        : undefined;
      // using pointers for the current transaction/interest rule, as well as the next one
      if (nextRateDay && nextRateDay === i && nextTxDay && nextTxDay === i) {
        // if new rule and new transaction on that day, use the next transaction and interest rule
        totalInterest +=
          (txs[txIndex + 1].getBalance() * rules[rateIndex + 1].getRate()) /
          100;
        txIndex++;
        rateIndex++;
      } else if (nextRateDay && nextRateDay === i) {
        // if only new interest rule, increment pointer and use new rule
        totalInterest +=
          (txs[txIndex].getBalance() * rules[rateIndex + 1].getRate()) / 100;
        rateIndex++;
      } else if (nextTxDay && nextTxDay === i) {
        // if only new transaction, increment pointer and use new transaction balance
        totalInterest +=
          (txs[txIndex + 1].getBalance() * rules[rateIndex].getRate()) / 100;
        txIndex++;
      } else if (currentRateDay <= i && currentTxDay <= i) {
        // no new rule and no new transaction on this day, calculate using current rule and current balance
        totalInterest +=
          (txs[txIndex].getBalance() * rules[rateIndex].getRate()) / 100;
      }
    }
    // note that this interest rate has not been divided by 365 days yet!
    return totalInterest;
  };

  printStatementData = (accName, data) => {
    console.log("Account: " + accName);
    console.log("| Date     | Txn Id      | Type | Amount | Balance |");
    if (data.length > 0) {
      data.map((tx) => {
        return tx.printStatementTransaction();
      });
    }
  };
}
