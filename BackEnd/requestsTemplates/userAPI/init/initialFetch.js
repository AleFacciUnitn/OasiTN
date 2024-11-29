const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://localhost:5000/api/user/init", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));