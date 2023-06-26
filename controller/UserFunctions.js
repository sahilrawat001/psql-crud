let data = require("../database/user.json");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const { newIndex } = require("./sidefunction");
const { request, response } = require("express");

const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mydb",
    password: "1234",
    port: 5432,
});
const userController = {};

// finds the matching mail with data
let userMail = (tokenid) => data.find((i) => i.mail == tokenid);

// finds the matching password with data
let userPassword = (tokenid) => data.find((i) => i.password == tokenid);


// function fsPush(data) {
//     fs.writeFileSync("./database/user.json", JSON.stringify(data), "utf-8");
// }
// function tokenPush(data) {
//     fs.writeFileSync("./database/token.json", JSON.stringify(data), "utf-8");
// }

userController.updateTutorial = (request, response) => {
    console.log(request.body);
    // const keys = Object.keys(request.body); // Get the keys from req.body
    // const values = Object.values(request.body);
    // console.log(keys,values);
    let query = "update tutorials set ";
    let bind = [];
    let count = 1;
    if (request.body.id) {
         bind.push(request.body.id);
        count++;
    }
    console.log(bind.indexOf(request.body.id),'1');
     if (request.body.title || request.body.description || request.body.published) {
         for (let key in request.body) {
             if (key=='id') {
                 continue;
             }
              console.log(key);
             query += `${key}=$${count}, `;
             bind.push(request.body[key]);

             count++;
             
            // query2.concat(key+"=" +request.body[key] +"," );
            // console.log(key, request.body[key],query2,'=================');
         }
         query = query.slice(0, -2);

     }
    
    if (request.body.id) {
        query += " WHERE id = $1";
    }
    console.log(query,'->',bind,'----------');
    pool.query(query, bind, (err, result) => {
        if (err) {
            throw err;
        }
        response.status(200).json(result.rows);
    })
    
};

userController.getTutorials =  (request, response) => {
    // console.log(request.body.id);
    let query = "SELECT * FROM tutorials";

    if (request.body.id) {
        query += " WHERE id = $1";
    }

    pool.query(query,request.body.id?[request.body.id]:[] ,(error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
const randomNumber =async () => {
    let unique = 1;
    let randomThreeDigitNumber;
    while (unique) {   
        randomThreeDigitNumber = Math.floor(Math.random() * 9000) + 1000;
        console.log(randomThreeDigitNumber);
        let ans = await pool.query("select title from tutorials where id=$1", [randomThreeDigitNumber],
        );
        if (ans.rowCount==0) {
            unique = 0;
        }
        
    }
    return randomThreeDigitNumber;
};
userController.createTutorial = async(request, response) => {
    const time = new Date();
    // console.log(time,request.body); 
    const { title, description, published } = request.body;
    let t = title;
    let randomThreeDigitNumber =await randomNumber();
    pool.query("INSERT INTO tutorials VALUES ($1, $2, $3 ,$4, $5,$6) RETURNING *", [randomThreeDigitNumber,t, description,published,time,time], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
};

userController.deleteTutorial = (request, response) => {
    pool.query(`delete from  tutorials where id =$1`, [request.body.id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).json('deleted successfully');
    } )
}

userController.signUp = (req, res) => {
    //gets object from id
    let checkEmail = userMail(req.body.mail);

    if (checkEmail) {
        res.status(400).send(" user already existed");
    } else {
        //assigning index to new user
        req.body.id = newIndex();
        console.log(req.body.id);
        data.push(req.body);
        let token = jwt.sign({ id: req.body.id }, secret, { expiresIn: "3h" });
        let obj = new Object;
        obj.token = token;
        console.log(obj);
        tokenPush(obj);
        fsPush(data);
     
        res.status(200).send(JSON.stringify({ token }));

    }
};

const signIn = (req, res) => {
    let checkEmail = userMail(req.body.mail);
    let checkPassword = userPassword(req.body.password);

    if (!checkEmail || !checkPassword) {
        res.status(400).send(" signup first");
    } else {
        if (checkEmail.id != checkPassword.id) {
            console.log("invalid");
            res.status(404).send("invalid");
        }

        else {

            let token = jwt.sign({ id: checkEmail.id }, secret, { expiresIn: "3h" });
            console.log(" ok");
            let obj = new Object;
            obj.token = token;
            console.log(obj);
            tokenPush(obj);
            res.status(200).send(JSON.stringify({ token }));
        }

    }
};

module.exports = { userController};
