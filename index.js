//npm init -y
//npm install nodemon
//npm install express
//npm install uuid
//install faker from npm
//install method-override
//install mysql2
const express=require("express");
const app=express();
const path=require("path");
const { faker } = require('@faker-js/faker');//install faker form npm
const mysql=require('mysql2');
const methodOverride=require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'userdata',
    password:"AByz@#45"
});
let createRandomUser = ()=> {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
]
}
let port=8080;
app.listen(port,()=>{
  console.log(`listening on port ${port}`);
});


// let user=[];
// for(let i=0;i<100;i++){
//   user.push(createRandomUser());
// }

// let q="INSERT INTO user (id, username, email, password) VALUES ?";
// try{
//     connection.query(q,[user],(err,result)=>{
//         if(err) throw err;
      
//     });
// }
// catch(err){
//     console.log(err);
// }

// connection.end();

app.get("/",(req,res)=>{
  let q=`select count(*) from user`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count=result[0]["count(*)"];
      res.render("home.ejs",{count});
    });
  }catch(err){
    res.send("error in database");
  }
});

app.get("/user",(req,res)=>{
    let q="SELECT * FROM user";
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        res.render("showusers.ejs",{result});
      });
    }catch(err){
      res.send("error from database");
    }
});


app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  }catch(err){
    res.send("error from database");
  }
});

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formpassword,username:newusername}=req.body;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      if(user.password!=formpassword){
        res.send("wrong password");
      }else{
        let q2=`UPDATE user SET username='${newusername}' WHERE id='${id}'`;
        try{
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");          
        });
      }
      catch(err){
        res.send("error in database");
      }
      }
});
  }catch(err){
    res.send("error from database");
  } 
});




