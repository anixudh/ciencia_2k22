let te_details = [
  {
    id: "1",
    name: "event1",
    description: "event1",
    img: "../assets/logos/ciencia.png",
    url: "../index.html",
  },
  {
    id: "1",
    name: "event2",
    description: "event2",
    img: "../assets/logos/ciencia-inv.png",
    url: "./non-technical_event.html.html",
  },
];
let ele = document.getElementById("row");
for (let i = 0; i < 40; i++) {
  ele.innerHTML +=
    '<div class="event m-2 col-2">' +
    '<div class="card bg-gradient-primary shadow">' +
    '<img class="card-img-top" src=' +
    te_details[i % 2].img +
    ' alt="image" />' +
    '<div class="card-body">' +
    '<h4 class="card-title">' +
    te_details[i % 2].name +
    "</h4>" +
    '<p class="card-text">' +
    te_details[i % 2].description +
    "</p>" +
    "</div>" +
    "</div>" +
    "</div>";
}
