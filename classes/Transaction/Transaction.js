export default class Transaction {
  constructor(date, id, type, amt, balance) {
    this.date = date;
    this.id = id;
    this.type = type;
    this.amt = amt;
    this.balance = balance;
  }

  getDate = () => {
    return this.date;
  };

  getIdLastTwoDigits = () => {
    return this.id.substring(this.id.length - 2);
  };

  getBalance = () => {
    return this.balance;
  };

  printTransaction = () => {
    console.log(
      "| " +
        this.date +
        " | " +
        this.id +
        " |  " +
        this.type +
        "  | " +
        this.amt +
        " |"
    );
  };

  printStatementTransaction = () => {
    console.log(
      "| " +
        this.date +
        " | " +
        this.id +
        " | " +
        this.type +
        " | " +
        this.amt +
        " | " +
        this.balance +
        " | "
    );
  };
}
