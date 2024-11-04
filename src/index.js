let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch existing toys from the server
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => renderToy(toy));
    });

  // Toggle the form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Handle form submission to create a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0,
    };

    // Post the new toy to the server
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        renderToy(toy);
        toyForm.reset(); // Clear the form fields
      });
  });

  // Function to render a toy
  function renderToy(toy) {
    const toyDiv = document.createElement("div");
    toyDiv.classList.add("toy-card");

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.alt = toy.name;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.textContent = "Like ❤️";
    likeButton.addEventListener("click", () => {
      toy.likes++;
      p.textContent = `${toy.likes} Likes`;

      // Update likes on the server
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: toy.likes }),
      });
    });

    toyDiv.appendChild(h2);
    toyDiv.appendChild(img);
    toyDiv.appendChild(p);
    toyDiv.appendChild(likeButton);
    toyCollection.appendChild(toyDiv);
  }
});
