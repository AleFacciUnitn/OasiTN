const myHeaders = new Headers();
myHeaders.append("password", "1234");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:5000/api/admin/Tag/67483f886bef1bec50ad2767", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));