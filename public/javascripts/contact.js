$(document).ready(() => {
  console.log("contact client active");

  $("#contactForm").on("submit", (e) => {
    e.preventDefault();
    console.log("form captured");

    //capture form data
    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries());
    console.log(data);

    //send to backend

    fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("error fetch ", response.statusText);
          return response.text();
        }
        return response.json();
      })

      .then((data) => {
        console.log(data);
      })

      .catch((error) => {
        console.error("fetch error", error);
      });
    e.target.reset();
  });
});
