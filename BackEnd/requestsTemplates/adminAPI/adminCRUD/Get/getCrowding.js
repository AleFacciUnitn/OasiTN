const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  //Anche se è in admin, non ho messo la password perchè non è necessaria
  //Si potrebbe spostare da qualche altra parte assieme alle api misc
  
  fetch("http://localhost:8888/api/admin/Crowding", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));