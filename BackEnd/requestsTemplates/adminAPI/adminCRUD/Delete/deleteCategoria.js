const myHeaders = new Headers();
myHeaders.append("password", "1234");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:5000/api/admin/Categoria/67483ff7beb487d0bd311bef", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));