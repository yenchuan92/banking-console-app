Welcome to the banking app demo!
This project was built using NodeJS, and minimal node modules. Code relies on as little libraries/modules as possible, and mainly focuses on functionality.

To run the program, first ensure you have npm and nodejs installed.
Then, open a command prompt and cd into the banking-console-app folder.
Run "npm install" to install the node modules.
Run the command "node index.js", this will start the application.

To run the unit tests, cd into the banking-console-app folder.
Run the command "npm test".

Further potential improvements
-Use typescript to validate the data types, especially for the balance and amount
-Implement bringing forward of previous month's balance into next month's transactions
-Storing the data into a database, mongodb?
-Implement readline.close after a certain timeout or period of inactivity
-Formatting of the console logs to ensure that the columns are all aligned
-Extract out the strings into a constants file and import it into index.js for usage
