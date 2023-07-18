require("dotenv").config();

const people = require("./people.json");
const lineNotify = require("line-notify-nodejs")(process.env.LINE_TOKEN);

const line = require("@line/bot-sdk");

const lineConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_TOKEN,
};

const client = new line.Client(lineConfig);

let index = 0;
let time_set = "08:00:00";

let task_complete = false;

let miss_task = 0

const send_task = () => {
  const date_now = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const index_new = index;

  const message = `วันนี้ (${date_now}) เป็นเวรประจำวันของ ${people[index_new].name}`;

  client.pushMessage("C27481d1d64ba608e5302bcfe5a58c7de" , { type : 'text' , text : message })

  // lineNotify
  //   .notify({
  //     message,
  //   })
  //   .then(() => {
  //     console.log("send completed!");
  //   });

};

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const data = {
    index,
    now_people: people[index].name,
    time_set,
    people,
  };

  res.send(data);
});

// app.post("/index", (req, res) => {
//   const index_input = req.body.index;

//   index = index_input;

//   res.json("OK");
// });

// app.post("/time_set", (req, res) => {
//   const time_set_input = req.body.time_set;

//   time_set = time_set_input;

//   res.json("OK");
// });

// app.get("/send", (req, res) => {
//   send_task();

//   res.json("OK");
// });

app.post("/webhook", async (req, res) => {
  try {
    const events = req.body.events;
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});

const handleEvent = async (event) => {
  const date_now = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const time_now = new Date().toLocaleTimeString();

  const index_new = index % people.length;

  const message = `วันนี้ (${date_now}) เป็นเวรประจำวันของ ${people[index_new].name}`;

  if (event.type === "message") {
    const text = event.message.text;

    if (text === "!help") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "สวัสดี ผมคือผู้ช่วยเตือนงานบ้านของคุณ \n\n!task_now : เพื่อดูเวรประจำวันนี้\n!time_set : เพื่อตั้งเวลาแจ้งเตือนอัตโนมัติ\n!set_index [index] : เพื่อตั้งลำดับเวรใหม่\n!complete [ชื่อ] : เพื่อยืนยันเสร็จภารกิจ",
      });
    }

    if (text === "!task_now") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: message,
      });
    }

    const command_input = text.split(" ");

    if (command_input[0] === "!time_set") {
      time_set = command_input[1];
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: `ตั้งเวลาแจ้งเตือนเป็น ${command_input[1]} เรียบร้อยแล้ว`,
      });
    }

    if (command_input[0] === "!set_index") {
      index = command_input[1];
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: `เปลี่ยนลำดับเวรเป็น ${people[index].name} เรียบร้อยแล้ว`,
      });
    }

    if (command_input[0] === "!complete") {
      if (command_input[1] === "มิว") {
        if (index_new === 0 && !task_complete) {
          index = (1 + (miss_task)) % people.length;
          task_complete = true;
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `"มิว" ได้ทำภารกิจเรียบร้อยแล้ว (${time_now})`,
          });
        } else {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `ยังไม่ถึงเวรของ "มิว" อย่ารีบ เดี๋ยวได้ทำ`,
          });
        }
      }

      if (command_input[1] === "นิว") {
        if (index_new === 1 && !task_complete) {
          index = (2 + (miss_task)) % people.length;
          task_complete = true;
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `"นิว" ได้ทำภารกิจเรียบร้อยแล้ว (${time_now})`,
          });
        } else {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `ยังไม่ถึงเวรของ "นิว" อย่ารีบ เดี๋ยวได้ทำ`,
          });
        }
      }

      if (command_input[1] === "มายด์") {
        index = (3 + (miss_task)) % people.length
        task_complete = true;
        if (index_new === 2 && !task_complete) {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `"มายด์" ได้ทำภารกิจเรียบร้อยแล้ว (${time_now})`,
          });
        } else {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `ยังไม่ถึงเวรของ "มายด์" อย่ารีบ เดี๋ยวได้ทำ`,
          });
        }
      }

      if (command_input[1] === "เก้น") {
        index = (0 + (miss_task)) % people.length;
        task_complete = true;
        if (index_new === 3 && !task_complete) {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `"เก้น" ได้ทำภารกิจเรียบร้อยแล้ว (${time_now})`,
          });
        } else {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `ยังไม่ถึงเวรของ "เก้น" อย่ารีบ เดี๋ยวได้ทำ`,
          });
        }
      }
    }
  }
};

const loop = setInterval(() => {
  const date = new Date();
  const time_now = date.toLocaleTimeString();

  if (time_now === time_set) {

    if (task_complete) {

      send_task();
      task_complete = false;
      miss_task = 0;

    }else{

      miss_task += 1
      client.pushMessage("C27481d1d64ba608e5302bcfe5a58c7de" , { type : 'text' , text : `${people[index].name} ยังไม่ได้ทำภารกิจ อย่าลืมทำด้วย` })
    }
    
  }
}, 1000);

app.listen(1392, () => console.log("Server is running..."));
