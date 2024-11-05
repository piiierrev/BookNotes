import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import session from 'express-session';
import 'dotenv/config';
import { searchBook } from "./openBookAPI.js";
import bcrypt from "bcrypt"




//configuration d'Express
const app = express();
const port = 3000;


// Configuration de la base de données PostgreSQL
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'bookproject',
    password: process.env.PG_SQL_KEY,
    port: 5433
  });
  db.connect();



//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


// Middleware pour gérer les sessions
app.use(session({
    secret: process.env.SECRET_KEY,  // Clé pour signer le cookie de session
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },  // Utilisez true si HTTPS est activé
  }));

//home page
app.get('/', (req, res) => {
    
    res.render("index.ejs")
  })


// SIGN IN (GET pour afficher le formulaire, POST pour soumettre)
app.get('/login', (req, res) => {
    
    res.render("login.ejs")})

app.post('/login', async (req, res) => {
        const { first_name, password } = req.body;
      
        try {
          // Find the user by first_name in the database
          const result = await db.query("SELECT * FROM users WHERE first_name = $1", [first_name]);
      
      
          if (result.rows.length === 0) {
            return res.send('User not found');  // User doesn't exist
          }
      
          const user = result.rows[0];
      
          // Compare the password with the hashed password stored in the database
          const validPassword = await bcrypt.compare(password, user.password);
          
          if (!validPassword) {
            return res.send('Incorrect password');  // Password doesn't match
          }
      
          // If authentication is successful, create a session for the user
          req.session.user = { id: user.id, first_name: user.first_name };
          res.redirect('/dashboard');  // Redirect to a protected dashboard page
        } catch (error) {
          console.error(error);
          res.status(500).send('Server error');
        }
      });
   
// SIGN UP (GET pour afficher le formulaire, POST pour soumettre)
app.get('/signup', (req, res) => {
    
    res.render("signup.ejs")})

app.post('/signup', async (req, res) => {
    const { first_name, password, confirm_password } = req.body;
    
    // Check if the passwords match
    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match. Please try again.');
    }
    
    try {
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Insert the new user into the database
        await db.query("INSERT INTO users (first_name, password) VALUES ($1, $2)", [first_name, hashedPassword]);
    
        // Redirect to the login page after successful signup
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during signup');
    }
    });


// POST route to log the user out
app.post('/logout', isAuthenticated, (req, res) => {
    // Destroy the session to log the user out
    console.log (req)
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error logging out');
      }
      
      // Redirect to the login page after session is destroyed
      res.redirect('/');
    });
  });

//user dashboard :
app.get("/dashboard", isAuthenticated, (req, res) => {
    
    res.render("dashboard.ejs")
})


//search book route :
app.post("/dashboard/search", async(req, res) =>{
    
    const book_list = await searchBook(req.body.book_title);
    

    res.render("search.ejs", {
        book_list : book_list
    })


})


//Create Note route : 
app.post("/createNote", isAuthenticated, async (req,res) => {
  const data = req.body
  const {title , authorName , coverId, bookKey, note} = req.body
  console.log("new note received" , data)
  
  // check if the book is alreay in the database and get its id
  let bookId = await db.query("SELECT id FROM books WHERE key = $1", [bookKey]);
  
  if (bookId.rows.length === 0){
    //if book doesn't exist,try to add the book and return the id
      try {
        bookId = await db.query("INSERT INTO books ( author, title, coverid, key) VALUES ($1, $2, $3, $4) RETURNING id", [authorName, title , coverId, bookKey]);
        console.log("book doesn't exist -> register new book")
      } catch (error) {
      console.error(error)
      res.sendStatus(500);
      }
    }
  
  else{ console.log("book already exist in the database")}

    //Create a new note for the (user_id, book_id) pair
    try {
      await db.query("INSERT INTO users_notes ( user_id, book_id, note) VALUES ($1, $2, $3)", [req.session.user.id,bookId.rows[0].id, note]);
      console.log("note saved")
      res.sendStatus(200);

    } catch (error) {
      console.error(error)
      res.sendStatus(500);
    }
  
})
 
//Update Note route : 
app.put("/editNote" , isAuthenticated, async (req,res) =>{
  const data = req.body
  const {userId , bookId , note} = req.body
  console.log("updated note received" , data)
  
  try {
        await db.query("UPDATE users_notes SET note = $1 WHERE (user_id, book_id)=($2,$3)", [note, userId,bookId]);
        console.log("note modified")
      } 
    catch (error) {

      console.error(error)
      res.sendStatus(500);
      }
    
    
res.sendStatus(200);

})

//delete note route : 
app.delete("/deleteNote" , isAuthenticated, async (req,res) =>{
  const data = req.body
  const {userId , bookId} = req.body
  console.log("delete order received for:" , data)
  
  try {
        await db.query("DELETE FROM users_notes WHERE (user_id, book_id)=($1,$2)", [userId,bookId]);
        console.log("note deleted")
      } 
    catch (error) {

      console.error(error)
      res.sendStatus(500);
      }
    
    
res.sendStatus(200);


})

// GET dashboard/mynotes route
app.get("/dashboard/mynotes", isAuthenticated, async (req, res) => {
  

  try{
  const response = await db.query("SELECT  note, author, title, coverid, user_id, book_id FROM users_notes JOIN books ON books.id=users_notes.book_id WHERE users_notes.user_id=$1",[req.session.user.id]);
  const notes = response.rows
  res.render("mynotes.ejs",{notes : notes})

} catch(error){
  console.error(error)
  res.sendStatus(500).render("mynotes.ejs")
  }

  

})


//GET dashboard/search route
app.get("/dashboard/search", isAuthenticated, (req,res) => {
 
  res.render("search.ejs")
})

//GET dashboard/settings route
app.get("/dashboard/settings", isAuthenticated, (req,res) => {
  
  res.render("settings.ejs")
})



  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })



//// Middleware to protect routes that require authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      next();  // User is authenticated, proceed to the next middleware or route handler
    } else {
      res.redirect("/login");  // If not authenticated, redirect to login
    }
  }