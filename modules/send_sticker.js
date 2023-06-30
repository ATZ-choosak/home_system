const Sticker = (stickerPackageId , stickerId) => {
  const formData = new URLSearchParams({ 
    message: "test",
    type: 'sticker',
    stickerPackageId,
    stickerId
  });

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

module.exports = Sticker;
