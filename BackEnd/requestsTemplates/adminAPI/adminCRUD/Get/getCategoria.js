const myHeaders = new Headers();
myHeaders.append("password", "1234");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};
     
      // Change the URL to match the URL of the API you are using: .../api/admin/Categoria/<id>
fetch("http://localhost:5000/api/admin/Categoria/<id>", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));