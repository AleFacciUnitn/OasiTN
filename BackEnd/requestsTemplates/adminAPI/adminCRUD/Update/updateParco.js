const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "nome": "Parco delle Panchine Nuovo",
  "location": {
    "lat": 45.23456,
    "long": 11.65432
  },
  "infoParco": "Parco con ancora più panchine",
  "addTags": [
    {
      "tagId": "67420e81a3120494c875a8b9",
      "count": 3,
      "positions": [
        {
          "lat": 45.23456,
          "long": 11.65432
        },
        {
          "lat": 45.23457,
          "long": 11.65433
        },
        {
          "lat": 45.23457,
          "long": 11.65433
        }
      ]
    }
  ],
  "removeTagIds": [
    "67420e81a3120494c875a8b8"
  ],
  "password": "1234"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};
      // Change the URL to match the URL of the API you are using: .../api/admin/Parco/<id>
fetch("http://localhost:5000/api/admin/Parco/<id>", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));