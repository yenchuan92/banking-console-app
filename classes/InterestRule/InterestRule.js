export default class InterestRule {
  constructor(date, name, rate) {
    this.date = date;
    this.name = name;
    this.rate = rate;
  }

  getDate = () => {
    return this.date;
  };

  updateRule = (name, rate) => {
    this.name = name;
    this.rate = rate;
  };

  getName = () => {
    return this.name;
  };

  getRate = () => {
    return this.rate;
  };

  printInterestRule = () => {
    console.log(
      "| " + this.date + " | " + this.name + " | " + this.rate + " |"
    );
  };
}
