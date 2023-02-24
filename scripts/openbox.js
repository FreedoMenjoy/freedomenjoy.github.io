function openbox(box) {
    const element = document.querySelector(box);
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}
