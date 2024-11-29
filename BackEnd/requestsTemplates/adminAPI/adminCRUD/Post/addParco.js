const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "nome": "Parco delle panchine",
  "location": {
    "lat": 45.12345,
    "long": 11.54321
  },
  "tags": [
    {
      "nome": "panchina",
      "count": 5,
      "positions": [
        {
          "lat": 45.1235,
          "long": 11.54322
        },
        {
          "lat": 45.12351,
          "long": 11.54323
        },
        {
          "lat": 45.12352,
          "long": 11.54324
        },
        {
          "lat": 45.12353,
          "long": 11.54325
        },
        {
          "lat": 45.12354,
          "long": 11.54326
        }
      ]
    }
  ],
  "infoParco": "Parco con molte panchine",
  "password": "1234"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:5000/api/admin/Parco", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));