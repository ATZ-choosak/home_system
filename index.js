require("dotenv").config();

const people = require("./people.json");
const Message = require("./modules/send_message");
const Sticker = require("./modules/send_sticker");

let index = 0;

const send_task = () => {
  const date_now = new Date().toLocaleDateString();
  const index_new = index % people.length;

  const message = `วันนี้ (${date_now}) เป็นเวรประจำวันของ ${people[index_new].name}`;
  Message(message);
};

const loop = setInterval(() => {
  const date = new Date();
  const time_now = date.toLocaleTimeString();
  const time_set = process.env.TIME_TO_SEND;

  if (time_now === time_set) {
    send_task();
    index++;
  }
}, 1000);

const express = require('express')
const app = express()

app.use(express.json())

app.get("/" , (req , res) => {

    const data = {
        index,
        now_people: people[index].name,
        people,
    }

    res.send(data)

})


app.post("/index" , (req , res) => {

    const index_input = req.body.index
    
    index = index_input

    res.json("OK")


})

app.get("/send" , (req , res) => {

    send_task()

    res.json("OK")


})

app.listen(1392 , () => console.log("Server is running..."))
