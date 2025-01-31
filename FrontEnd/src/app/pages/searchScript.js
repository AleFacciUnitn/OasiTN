const temp = document.querySelector("[search-data-template]");
const results = document.querySelector("[data-results-container]");
const ricerca = document.querySelector("[search-data]");

let parchi = [];

ricerca.addEventListener("input", e => {
    const search = e.target.value;
    //una volta visto come arrivano i dati posso fare anche la ricerca per tag
    parchi.forEach(element => {
        if (element.title.includes(search) || element.description.includes(search)) {
            element.element.style.display = "block";
        } else {
            element.element.style.display = "none";
        }
    });

});
//fetch dei dati
fetch()
    .then(response => response.json())//o altro
    .then(data => {
        user = data.map(element => {
            const clone = temp.content.cloneNode(true);
            clone.querySelector("#result-title").textContent = element.title;
            clone.querySelector("#result-description").textContent = element.description;
            results.append(clone);
            return { title: element.title, description: element.description, element: clone };
        });
    })