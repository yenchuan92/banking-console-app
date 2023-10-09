import InterestRule from "../InterestRule/InterestRule.js";
import { isInvalidDate } from "../../helpers.js";

export default class InterestRuleMenu {
  constructor(bankInstance, readLineAsync) {
    this.bankInstance = bankInstance;
    this.readLineAsync = readLineAsync;
  }

  initialize = async (msg = "") => {
    const userRes = await this.readLineAsync(msg, [
      "Please enter interest rules details in <Date> <RuleId> <Rate in %> format ",
      "(or enter blank to go back to main menu):",
    ]);

    if (userRes) {
      const data = userRes.split(" ");
      if (
        data.length === 3 &&
        this.validateInterestData(data[0], data[1], data[2])
      ) {
        // add the interest rule, if there is existing one with same date, it will replace the data
        const sameDayRule = this.bankInstance
          .getInterestRules()
          .filter((rule) => {
            return rule.getDate() === data[0];
          });

        if (sameDayRule.length > 0) {
          // modify the existing InterestRule obj
          sameDayRule[0].updateRule(
            data[1],
            parseFloat(parseFloat(data[2]).toFixed(2))
          );
        } else {
          // push new obj in
          this.bankInstance.addInterestRule(
            new InterestRule(
              data[0],
              data[1],
              parseFloat(parseFloat(data[2]).toFixed(2))
            )
          );
        }
        return this.bankInstance.showStartMenu();
      } else {
        console.log("Invalid interest rule, please try again!");
        return this.bankInstance.showStartMenu();
      }
    } else {
      return this.bankInstance.showStartMenu();
    }
  };

  validateInterestData = (date, name, rate) => {
    if (isInvalidDate(date, "YYYYMMDD")) {
      // invalid date
      console.log("Invalid Date format, please try again!");
      return false;
    } else if (
      !/\d/.test(rate) ||
      parseFloat(rate) < 0 ||
      parseFloat(rate) > 100
    ) {
      // invalid interest rate
      console.log("Interest rate must be between 0 and 100, please try again!");
      return false;
    }
    return true;
  };

  printInterestRuleData = () => {
    console.log("Interest rules: ");
    console.log("| Date     | RuleId | Rate |");
    this.bankInstance.getInterestRules().map((rule) => {
      rule.printInterestRule();
    });
    console.log("");
    this.bankInstance.showStartMenu();
  };
}
