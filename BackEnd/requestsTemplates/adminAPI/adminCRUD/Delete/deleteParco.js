const myHeaders = new Headers();
myHeaders.append("password", "1234");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:5000/api/admin/Parco/674216d0fc2e7dbd67e48c00", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));