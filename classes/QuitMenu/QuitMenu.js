export default class QuitMenu {
  constructor(bankInstance, readline) {
    this.bankInstance = bankInstance;
    this.readline = readline;
  }

  initialize = () => {
    console.log(
      "Thank you for banking with " + this.bankInstance.getName() + " Bank."
    );
    console.log("Have a nice day!");
    this.readline.close();
  };
}
