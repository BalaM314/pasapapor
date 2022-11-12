const content = getElement("div.content", HTMLDivElement);
const toggleBtn = getElement("button.theme", HTMLButtonElement);
const icon = getElement("span.material-icons", HTMLSpanElement);


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

switch(localStorage.getItem("theme")){
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
	if(localStorage.getItem("theme") == "light") enableDarkMode();
	else if(localStorage.getItem("theme") == "dark") enableLightMode();
	else { console.warn("Theme is invalid"); enableDarkMode(); }
});
