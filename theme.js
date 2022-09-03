let darkMode = localStorage.getItem("darkTheme");
const main = document.querySelector("div.content");
const toggleBtn = document.querySelector("button.theme");
const icon = document.querySelector("span.material-icons");
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