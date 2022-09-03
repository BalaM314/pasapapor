"use strict";
const content = document.querySelector("div.content");
const toggleBtn = document.querySelector("button.theme");
const icon = document.querySelector("span.material-icons");
function enableDarkMode() {
    localStorage.setItem("theme", "dark");
    content.classList.remove("lightTheme");
    content.classList.add("darkTheme");
    icon.innerText = "light_mode";
}
function enableLightMode() {
    localStorage.setItem("theme", "light");
    content.classList.remove("darkTheme");
    content.classList.add("lightTheme");
    icon.innerText = "dark_mode";
}
switch (localStorage.getItem("theme")) {
    case "dark":
        enableDarkMode();
        break;
    case "light":
        enableLightMode();
        break;
    case null:
        enableDarkMode();
        break;
    default:
        console.warn(`Invalid theme ${localStorage.getItem("theme")}`);
        enableDarkMode();
        break;
}
toggleBtn.addEventListener("click", () => {
    if (localStorage.getItem("theme") == "light")
        enableDarkMode();
    else if (localStorage.getItem("theme") == "dark")
        enableLightMode();
    else {
        console.warn("Theme is invalid");
        enableDarkMode();
    }
});
