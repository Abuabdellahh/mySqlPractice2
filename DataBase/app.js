// Working with databases (MySql) - Practice Exercises

// Question 1: Create a MySQL database by the name "myDB" and create a database user by the name "myDBuser" with a permissions to connect with the "myDB" database. Use the "mysql" module to create a connection with the newly created database. Display console message if the connection is successful or if it has an error

// ************** import module*****************
const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const app = express();


// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())





// *********** connection***************
const Connection = mysql.createConnection({
  user: "myDBuser",
  password: "123456",
  host: "127.0.0.1",
  database: "myDB",
});

// ******* report******
Connection.connect((err) => {
   if (err) throw err;
  else console.log("database connected successfully!");
});

// *********************Question 2**********************
// Question 2: Here is a link to a document that contains the tables we need to create and convert the apple.com/iphones page INTo a dynamic page with a database. As you can see from the document, there are 5 tables that are needed (please scroll horizontally and vertically over the document to see all the 5 tables). Write a SQL query to create the apple.com tables inside of the "myDB" database you created above. Once you write the queries, use the "mysql" module to execute the queries on the database. Try both of these methods to initiate the execution of the queries:
// ● Include the execution code directly in the module to be executed as you run the app
// ● Use the Express module to receive requests. Configure your module in a way that it executes the queries when the "/install" URL is visited


// ****************TEST API ******************
app.get('/',(req,res)=>{
  res.send('work sucssefuly!')
})
// ************ create table via API******************
app.get("/install", (req, res) => {
  let message = "Tables Created";
  let Products = `CREATE TABLE if not exists Products(
      product_id INT AUTO_INCREMENT,
      product_url VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      PRIMARY KEY (product_id)
  )`;
  let createProductDescription = `CREATE TABLE if not exists ProductDescription(
    description_id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    product_brief_description TEXT NOT NULL,
    product_description TEXT NOT NULL,
    product_img TEXT NOT NULL,
    product_link VARCHAR(255) NOT NULL,
    PRIMARY KEY (description_id),
    FOREIGN KEY(product_id) REFERENCES Products(product_id)
  )`;
  let createProductPrice = `CREATE TABLE if not exists ProductPrice(
    price_id INT AUTO_INCREMENT,
    product_id INT(11) NOT NULL,    
    starting_price VARCHAR(255) NOT NULL,
    price_range VARCHAR(255) NOT NULL,
    PRIMARY KEY (price_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;
  let createUser = `CREATE TABLE if not exists user(
    user_id INT AUTO_INCREMENT,
    User_name VARCHAR(255) NOT NULL,
    User_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
  )`;
  let createOrders = `CREATE TABLE if not exists orders(
    order_id INT AUTO_INCREMENT,
    product_id INT(11) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;



// ***************** QUERY*********************
  Connection.query(Products, (err, results, fields) => {
      if (err) throw err;
    // else console.table(fields);
  });
  Connection.query(createProductDescription, (err, results, fields) => {
     if (err) throw err;
  //  else console.table(fields);
  });
  Connection.query(createProductPrice, (err, results, fields) => {
     if (err) throw err;
  //  else console.table(fields);
  });
  Connection.query(createUser, (err, results, fields) => {
     if (err) throw err;
  //  else console.table(fields);
  });
  Connection.query(createOrders, (err, results, fields) => {
     if (err) throw err;
   else console.table(fields);
  });

  res.end(message);
});

// ******************* INSERT Data API******************************
app.post("/addProduct", (req, res) => {

     const{UserName,UserPassword, ProductName,Description,Price,MonthlyPlan, Image, URL}=req.body;


    // **************** for query purpose*****************************
 let Products= `INSERT INTO Products (product_url, product_name) VALUES (?,?)`
 let ProductDescription=  `INSERT INTO ProductDescription (product_id,
                            product_brief_description,product_description,
                            product_img,product_link) VALUES (?,?,?,?,? )`
 let ProductPrice=        `INSERT INTO ProductPrice  (product_id,starting_price,
                           price_range) VALUES (?,?,?)`
 let user=    `INSERT INTO user (User_name, User_password) VALUES (?,?)`
let Orders=   `INSERT INTO Orders (product_id, user_id) VALUES (?,?)`


  // *****************query to insert data********************
  Connection.query( Products ,[ URL, ProductName],(err, result)=> {
        if (err) throw err;
      console.log("1 record inserted");

      //  ************** used for foreign key****************
      const id = result.insertId;

      Connection.query(ProductDescription,[id,Description,Description,Image,URL], (err, result)=> {
            if (err) throw err;
            console.log("1 record inserted ");
        }
      );
      Connection.query(ProductPrice ,[id,Price,MonthlyPlan], (err, result)=>{
            if (err) throw err;
          console.log("1 record inserted");
        }
      );

      Connection.query(user, [UserName,UserPassword], (err, result)=>{
            if (err) throw err;
          console.log("1 record inserted");
          // *********** userID for foreign key purpose****************
          const user_id =result.insertId;
          Connection.query(Orders,[id,user_id],(err, result)=> {
                if (err) throw err;
              console.log("1 record inserted");
            }
          );
 
        }
      );


    }
  );

  // **************** report for inserted data*************************
  res.end("data inserted successfully!");
});

app.get('/getALL',(req,res)=>{
  let getAll=`SELECT*FROM  orders JOIN productdescription 
  JOIN productprice JOIN products JOIN user
   ON products.product_id= orders.product_id AND
  products.product_id=productdescription.product_id AND
   products.product_id=productprice.product_id ;`
   Connection.query(getAll,(err,result)=>{
    if(err) throw err;
    else console.log(result);
    res.send(result)
   })
  
})

// ************* server and hostName*****************
const port=process.env.PORT|| 2025
let hostName="localhost"

app.listen(port,()=>{
  console.log(`Server is running on ${port} http://${hostName}:${port}`);
})