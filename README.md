0. Walkthrough video: https://general-project-assets.s3.ap-south-1.amazonaws.com/currency-converter/currency_converter_walkthrough.mp4
1. Install pm2 globally
  - ```npm i -g pm2```

2. Set the database up:
  - Create a database as given in the db.js file and run the following command to create the table.
    ```CREATE TABLE `conversion` (```
    ```id int(11) NOT NULL AUTO_INCREMENT,```
    ```currency varchar(10) NOT NULL,```
    ```exchange_rate decimal(30,12) NOT NULL,```
    ```updated_on DATETIME NOT NULL,```
    ```invalid tinyint(1),```
    ```PRIMARY KEY (id),```
    ```KEY conversion_by_currency (currency) USING BTREE```
    ```) ENGINE=InnoDB DEFAULT CHARSET=utf8;```

  - Once done, modify the cron job (index.js file in the cron folder) to run every minute so the table gets populated.

3. Make sure you're on node version: 12.13.1

4. Run the node server by cd'ing into the node-server folder and running
  - ```npm i``` - installs all dependencies.
  - ```npm run local``` - this will run the backend server on port: 3000

5. Run the front end of the application by going to the source folder and running
  - ```npm i``` - installs all dependencies.
  - ```npm start``` - starts the front-end app

6. You should see the app up on http://localhost:4200