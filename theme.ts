let darkMode = localStorage.getItem("darkTheme");
const main = document.querySelector("div.content") as HTMLDivElement;
const toggleBtn = document.querySelector("button.theme") as HTMLButtonElement;
const icon = document.querySelector("span.material-icons") as HTMLSpanElement;
icon.innerText = "dark_mode";

function enableDarkMode() {
	localStorage.setItem('darkTheme', 'enabled');
	main.classList.remove('lightTheme');
	main.classList.add('darkTheme');
	icon.innerText = "light_mode";
}

function disableDarkMode() {
	localStorage.setItem('darkTheme', '')
	main.classList.remove('darkTheme');
	main.classList.add('lightTheme');
	icon.innerText = "dark_mode";
}


if(darkMode === 'enabled') enableDarkMode()
	toggleBtn.addEventListener("click", () => {
	darkMode = localStorage.getItem('darkTheme')
	if (darkMode !== 'enabled') enableDarkMode()
	else disableDarkMode();
})