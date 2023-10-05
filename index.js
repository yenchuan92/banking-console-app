import { createInterface } from "readline";
import moment from "moment";

const accounts = {};
const interestRules = {};

export const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const readLineAsync = (startMsg, msgs) => {
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

export const validateTransactionData = (data) => {
  let result = true;
  if (isInvalidDate(data[0], "YYYYMMDD")) {
    // invalid date
    console.log("Invalid Date format, please try again!");
    result = false;
  } else if (data[2].toLowerCase() !== "d" && data[2].toLowerCase() !== "w") {
    // invalid type
    console.log("Invalid Type format, please try again!");
    result = false;
  } else if (
    parseFloat(data[3]) <= 0 ||
    (data[3].includes(".") && data[3].split(".")[1].length > 2)
  ) {
    // more than 2 decimal places or 0 or negative number
    console.log("Invalid Amount, please try again!");
    result = false;
  } else if (data[2].toLowerCase() === "w") {
    // withdrawal
    if (
      accounts[data[1]] &&
      accounts[data[1]][accounts[data[1]].length - 1].balance <
        parseFloat(data[3])
    ) {
      // balance will become negative
      result = false;
    } else if (!accounts[data[1]] || accounts[data[1]].length === 0) {
      // no previous transactions, can't do a withdrawal!
      result = false;
    }
  }
  return result;
};

export const validateInterestData = (data) => {
  let result = true;
  if (isInvalidDate(data[0], "YYYYMMDD")) {
    // invalid date
    console.log("Invalid Date format, please try again!");
    result = false;
  } else if (
    !/\d/.test(data[2]) ||
    parseFloat(data[2]) < 0 ||
    parseFloat(data[2]) > 100
  ) {
    // invalid interest rate
    console.log("Interest rate must be between 0 and 100, please try again!");
    result = false;
  }
  return result;
};

export const validatePrintStatementData = (data) => {
  let result = true;
  if (isInvalidDate(data[1], "YYYYMM")) {
    // invalid date
    console.log("Invalid Date format, please try again!");
    result = false;
  } else if (!accounts[data[0]]) {
    // non existent account
    console.log("Account not found, please try again!");
    result = false;
  }
  return result;
};

export const isInvalidDate = (date, format) => {
  return (
    !moment(date, format, true).isValid() ||
    date.length !== format.length ||
    !/\d/.test(date)
  );
};

export const calculateInterest = (data, rules) => {
  const totalDays = moment(data[0].date, "YYYYMMDD").daysInMonth();
  let totalInterest = 0;
  let txIndex = 0;
  let rateIndex = 0;
  for (let i = 1; i < totalDays + 1; i++) {
    // loop through all the days in the month and then add them all up
    const currentTxDay = moment(data[txIndex].date, "YYYYMMDD").date();
    const nextTxDay = data[txIndex + 1]
      ? moment(data[txIndex + 1].date, "YYYYMMDD").date()
      : undefined;
    const currentRateDay = moment(rules[rateIndex].date, "YYYYMMDD").date();
    const nextRateDay = rules[rateIndex + 1]
      ? moment(rules[rateIndex + 1].date, "YYYYMMDD").date()
      : undefined;
    // using pointers for the current transaction/interest rule, as well as the next one
    if (nextRateDay && nextRateDay === i && nextTxDay && nextTxDay === i) {
      // if new rule and new transaction on that day, use the next transaction and interest rule
      totalInterest +=
        (data[txIndex + 1].balance * rules[rateIndex + 1].rate) / 100;
      txIndex++;
      rateIndex++;
    } else if (nextRateDay && nextRateDay === i) {
      // if only new interest rule, increment pointer and use new rule
      totalInterest +=
        (data[txIndex].balance * rules[rateIndex + 1].rate) / 100;
      rateIndex++;
    } else if (nextTxDay && nextTxDay === i) {
      // if only new transaction, increment pointer and use new transaction balance
      totalInterest +=
        (data[txIndex + 1].balance * rules[rateIndex].rate) / 100;
      txIndex++;
    } else if (currentRateDay <= i && currentTxDay <= i) {
      // no new rule and no new transaction on this day, calculate using current rule and current balance
      totalInterest += (data[txIndex].balance * rules[rateIndex].rate) / 100;
    }
  }
  // note that this interest rate has not been divided by 365 days yet!
  return totalInterest;
};

export const startMenu = async (msg) => {
  const userRes = await readLineAsync(msg, [
    "[T] Input transactions ",
    "[I] Define interest rules ",
    "[P] Print statement ",
    "[Q] Quit ",
  ]);

  switch (userRes.toLowerCase()) {
    case "t":
      transactionsMenu();
      break;
    case "i":
      interestMenu();
      break;
    case "p":
      printMenu();
      break;
    case "q":
      quitMenu();
      break;
    default:
      console.log("Please enter a valid character!");
      startMenu("Welcome to AwesomeGIC Bank! What would you like to do?");
  }
};

export const transactionsMenu = async () => {
  const userRes = await readLineAsync("", [
    "Please enter transaction details in <Date> <Account> <Type> <Amount> format ",
    "(or enter blank to go back to main menu):",
  ]);
  if (userRes) {
    const data = userRes.split(" ");
    if (data.length === 4 && validateTransactionData(data)) {
      if (accounts[data[1]]) {
        // there are existing transactions
        const transactions = accounts[data[1]];
        const sameDayTransactions = transactions.filter((tx) => {
          return tx.date === data[0];
        });
        if (sameDayTransactions.length > 0) {
          // get the current biggest id for that day's transactions and +1
          let latestId =
            parseFloat(
              sameDayTransactions[sameDayTransactions.length - 1].id.split(
                "-"
              )[1]
            ) + 1;
          if (latestId.toString().length === 1) {
            latestId = "0" + latestId.toString();
          }
          // push new transaction using the incremented id
          transactions.push({
            date: data[0],
            id: data[0] + "-" + latestId,
            type: data[2].toUpperCase(),
            amt: parseFloat(parseFloat(data[3]).toFixed(2)),
            balance:
              data[2].toLowerCase() === "d"
                ? parseFloat(transactions[transactions.length - 1].balance) +
                  parseFloat(parseFloat(data[3]).toFixed(2))
                : parseFloat(transactions[transactions.length - 1].balance) -
                  parseFloat(parseFloat(data[3]).toFixed(2)),
          });
          accounts[data[1]] = transactions;
        } else {
          // no transactions on this day yet, so id starts with -01
          transactions.push({
            date: data[0],
            id: data[0] + "-01",
            type: data[2].toUpperCase(),
            amt: parseFloat(parseFloat(data[3]).toFixed(2)),
            balance:
              data[2].toLowerCase() === "d"
                ? parseFloat(transactions[transactions.length - 1].balance) +
                  parseFloat(parseFloat(data[3]).toFixed(2))
                : parseFloat(transactions[transactions.length - 1].balance) -
                  parseFloat(parseFloat(data[3]).toFixed(2)),
          });
          accounts[data[1]] = transactions;
        }
      } else {
        // no existing transactions in this account yet
        if (data[2].toLowerCase() === "d") {
          // if deposit, create a new account and add the transaction
          accounts[data[1]] = [
            {
              date: data[0],
              id: data[0] + "-01",
              type: data[2].toUpperCase(),
              amt: parseFloat(parseFloat(data[3]).toFixed(2)),
              balance: parseFloat(parseFloat(data[3]).toFixed(2)),
            },
          ];
        } else {
          // attempted withdrawal on nonexistent account/account with no balance
          console.log("Account balance cannot be less than 0!");
          return transactionsMenu();
        }
      }
      console.log("Account: " + data[1]);
      console.log("| Date     | Txn Id      | Type | Amount |");
      accounts[data[1]].map((tx) => {
        console.log(
          "| " +
            tx.date +
            " | " +
            tx.id +
            " |  " +
            tx.type +
            "   | " +
            tx.amt +
            " |"
        );
      });
      console.log("");
      return startMenu("Is there anything else you'd like to do?");
    } else {
      console.log("Invalid transaction!");
      return transactionsMenu();
    }
  } else {
    return startMenu("Welcome to AwesomeGIC Bank! What would you like to do?");
  }
};

export const interestMenu = async () => {
  const userRes = await readLineAsync("", [
    "Please enter interest rules details in <Date> <RuleId> <Rate in %> format ",
    "(or enter blank to go back to main menu):",
  ]);
  if (userRes) {
    const data = userRes.split(" ");
    if (data.length === 3 && validateInterestData(data)) {
      // add the interest rule, if there is existing one with same date, it will replace the data
      interestRules[data[0]] = {
        date: data[0],
        id: data[1],
        rate: parseFloat(parseFloat(data[2]).toFixed(2)),
      };
      console.log("Interest rules: ");
      console.log("| Date     | RuleId | Rate |");
      Object.values(interestRules).map((obj) => {
        console.log("| " + obj.date + " | " + obj.id + " | " + obj.rate + " |");
      });
      console.log("");
      return startMenu("Is there anything else you'd like to do?");
    } else {
      console.log("Invalid interest rule!");
      return interestMenu();
    }
  } else {
    return startMenu("Welcome to AwesomeGIC Bank! What would you like to do?");
  }
};

export const printMenu = async () => {
  const userRes = await readLineAsync("", [
    "Please enter account and month to generate the statement <Account> <Year><Month> ",
    "(or enter blank to go back to main menu):",
  ]);
  if (userRes) {
    const data = userRes.split(" ");
    let calculatedInterest;
    // get the transactions in the target month
    const sameMonthTransactions = accounts[data[0]].filter((tx) => {
      return (
        moment(tx.date, "YYYYMMDD").month() ===
          moment(data[1], "YYYYMM").month() &&
        moment(tx.date, "YYYYMMDD").year() === moment(data[1], "YYYYMM").year()
      );
    });
    // get the interest rules in the target month
    const sameMonthInterestRules = Object.values(interestRules).filter(
      (rule) => {
        return (
          moment(rule.date, "YYYYMMDD").month() ===
            moment(data[1], "YYYYMM").month() &&
          moment(rule.date, "YYYYMMDD").year() ===
            moment(data[1], "YYYYMM").year()
        );
      }
    );
    if (data.length === 2 && validatePrintStatementData(data)) {
      // generate the interest calculation and append to transaction list based on current month
      if (
        sameMonthInterestRules.length > 0 &&
        sameMonthTransactions.length > 0
      ) {
        calculatedInterest =
          calculateInterest(sameMonthTransactions, sameMonthInterestRules) /
          365;
        sameMonthTransactions.push({
          date:
            moment(data[1], "YYYYMM").year().toString() +
            moment(data[1], "YYYYMM").month().toString() +
            moment(data[1], "YYYYMM").daysInMonth().toString(),
          id: "         ",
          type: "I",
          amt: parseFloat(parseFloat(calculatedInterest).toFixed(2)),
          balance:
            sameMonthTransactions[sameMonthTransactions.length - 1].balance +
            parseFloat(parseFloat(calculatedInterest).toFixed(2)),
        });
      }
      // if there is no transaction and/or no interest rule for that month, no need to calculate the interest!
      console.log("Account: " + data[0]);
      console.log("| Date     | Txn Id      | Type | Amount | Balance |");
      sameMonthTransactions.map((tx) => {
        console.log(
          "| " +
            tx.date +
            " | " +
            tx.id +
            " | " +
            tx.type +
            " | " +
            tx.amt +
            " | " +
            tx.balance +
            " | "
        );
        return;
      });
      console.log("");
      return startMenu(
        "Welcome to AwesomeGIC Bank! What would you like to do?"
      );
    }
  } else {
    return startMenu("Welcome to AwesomeGIC Bank! What would you like to do?");
  }
};

export const quitMenu = async () => {
  console.log("Thank you for banking with AwesomeGIC Bank.");
  console.log("Have a nice day!");
  readline.close();
};

startMenu("Welcome to AwesomeGIC Bank! What would you like to do?");
