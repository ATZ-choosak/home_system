const Message = (text) => {
  const formData = new URLSearchParams({ message: text });

  fetch(process.env.LINE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${process.env.LINE_TOKEN}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

module.exports = Message;
