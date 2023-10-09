import Transaction from "../Transaction/Transaction.js";

export default class Account {
  constructor(name, bankInstance, transactions) {
    this.name = name;
    this.bankInstance = bankInstance;
    this.transactions = transactions || [];
  }

  getName = () => {
    return this.name;
  };

  getAccountTransactions = () => {
    return this.transactions;
  };

  getLatestAccountTransaction = () => {
    return this.transactions[this.transactions.length - 1];
  };

  addTransaction = (date, type, amt) => {
    if (this.transactions.length > 0) {
      const sameDayTransactions = this.transactions.filter((tx) => {
        return tx.getDate() === date;
      });
      if (sameDayTransactions.length > 0) {
        // get the current biggest id for that day's transactions and +1
        let latestId =
          parseInt(
            sameDayTransactions[
              sameDayTransactions.length - 1
            ].getIdLastTwoDigits()
          ) + 1;
        if (latestId.toString().length === 1) {
          latestId = "0" + latestId.toString();
          // push new transaction using the incremented id
          const newTransactionId = date + "-" + latestId;
          const newTransactionType = type.toUpperCase();
          const newTransactionAmt = parseFloat(parseFloat(amt).toFixed(2));
          const newTransactionBalance =
            type.toLowerCase() === "d"
              ? parseFloat(this.getLatestAccountTransaction().getBalance()) +
                parseFloat(parseFloat(amt).toFixed(2))
              : parseFloat(this.getLatestAccountTransaction().getBalance()) -
                parseFloat(parseFloat(amt).toFixed(2));

          this.transactions.push(
            new Transaction(
              date,
              newTransactionId,
              newTransactionType,
              newTransactionAmt,
              newTransactionBalance
            )
          );
        } else {
          const newTransactionId = date + "-" + latestId;
          const newTransactionType = type.toUpperCase();
          const newTransactionAmt = parseFloat(parseFloat(amt).toFixed(2));
          const newTransactionBalance =
            type.toLowerCase() === "d"
              ? parseFloat(
                  this.getLatestAccountTransaction().getBalance().toFixed(2)
                ) + parseFloat(parseFloat(amt).toFixed(2))
              : parseFloat(
                  this.getLatestAccountTransaction().getBalance().toFixed(2)
                ) - parseFloat(parseFloat(amt).toFixed(2));

          this.transactions.push(
            new Transaction(
              date,
              newTransactionId,
              newTransactionType,
              newTransactionAmt,
              newTransactionBalance
            )
          );
        }
      } else {
        // no transactions on this day yet, so id starts with -01
        const newTransactionId = date + "-01";
        const newTransactionType = type.toUpperCase();
        const newTransactionAmt = parseFloat(parseFloat(amt).toFixed(2));
        const newTransactionBalance =
          type.toLowerCase() === "d"
            ? parseFloat(
                this.getLatestAccountTransaction().getBalance().toFixed(2)
              ) + parseFloat(parseFloat(amt).toFixed(2))
            : parseFloat(
                this.getLatestAccountTransaction().getBalance().toFixed(2)
              ) - parseFloat(parseFloat(amt).toFixed(2));

        this.transactions.push(
          new Transaction(
            date,
            newTransactionId,
            newTransactionType,
            newTransactionAmt,
            newTransactionBalance
          )
        );
      }
    } else {
      // no existing transactions in this account yet
      if (type.toLowerCase() === "d") {
        // if deposit, add transaction
        const newTransactionId = date + "-01";
        const newTransactionType = type.toUpperCase();
        const newTransactionAmt = parseFloat(parseFloat(amt).toFixed(2));
        const newTransactionBalance = parseFloat(parseFloat(amt).toFixed(2));
        this.transactions.push(
          new Transaction(
            date,
            newTransactionId,
            newTransactionType,
            newTransactionAmt,
            newTransactionBalance
          )
        );
      } else {
        // attempted withdrawal on nonexistent account/account with no balance
        console.log("Account balance cannot be less than 0!");
        this.bankInstance.transactionMenu.initialize();
      }
    }
    this.printTransactionData();
  };

  printTransactionData = () => {
    console.log("Account: " + this.name);
    console.log("| Date     | Txn Id      | Type | Amount |");
    if (this.transactions.length > 0) {
      this.transactions.map((tx) => tx.printTransaction());
    }
  };
}
