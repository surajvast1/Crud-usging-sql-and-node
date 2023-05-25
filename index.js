const express = require("express");
const bodyParser = require("body-parser");

const db = require('./queries')
const app = express();


app.use(bodyParser  .urlencoded({
extended: true
}));

app.get('/',(req,res) =>
{
    res.json({
        info:'Node js crud api using Postgress and sql'
    })
})

app.use(bodyParser.json());
app.get('/users',db.getUsers)
app.post('/users',db.createUser)
app.delete('/users/:id',db.deleteUser);
app.put('/users/:id',db.updateUserById);

app.listen(3000, () => console.log("Listening on port 3000"));