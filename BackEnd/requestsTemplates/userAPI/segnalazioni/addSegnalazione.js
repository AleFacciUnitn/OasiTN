const raw = "{\n  \"parcoId\": \"674216d0fc2e7dbd67e48c00\",\n  \"oggetto\": \"Panchina rotta\",\n  \"descrizione\": \"Una panchina vicino all'entrata principale è rotta e necessita di riparazione.\",\n  \"priorita\": 2\n}\n";

const requestOptions = {
  method: "POST",
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:8888/api/user/Segnalazioni", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));