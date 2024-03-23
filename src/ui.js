import { Level } from "./data.js";
import { escapeHTML, firstUsePopup, getElement, impossible } from "./funcs.js";
import { Papor, getPaporFromInput, providers } from "./papor.js";
//HTML elements
const pasapaporInput = getElement("#pasapapor-select", HTMLInputElement);
const levelSelectDiv = getElement("#level-select", HTMLDivElement);
const sourceSelectDiv = getElement("#source-select", HTMLDivElement);
const buttonIgcse = getElement("input#igcse", HTMLInputElement);
const buttonAsa = getElement("input#as-a", HTMLInputElement);
const buttonSourceGce = getElement("input#source-gceguide", HTMLInputElement);
const buttonSourceXtr = getElement("input#source-xtremepapers", HTMLInputElement);
const errorbox = getElement("#errorbox", HTMLDivElement); //TODO rename to output box
const headerText = getElement("#header-text", HTMLSpanElement);
const header = getElement("#header", HTMLDivElement);
const formatExplanation = getElement("#format-explanation", HTMLDivElement);
const hoverInfo = getElement("#hover-info", HTMLDivElement);
const infoHoverSpans = Array.from(formatExplanation.children);
const themeButton = getElement("#theme-button", HTMLButtonElement);
const themeIcon = getElement("span.material-icons", HTMLSpanElement);
export function getSelectedLevel() {
    var _a;
    const value = (_a = Array.from(levelSelectDiv.children).filter((el) => el instanceof HTMLInputElement && el.checked)[0]) === null || _a === void 0 ? void 0 : _a.value;
    if (value == "igcse")
        return Level.IGCSE;
    if (value == "as/a")
        return Level.A_LEVELS;
    else
        return null;
}
export function getSelectedSource(def = null) {
    var _a;
    const value = (_a = Array.from(sourceSelectDiv.children).filter((el) => el instanceof HTMLInputElement && el.checked)[0]) === null || _a === void 0 ? void 0 : _a.value;
    console.log(value);
    if ((Object.keys(providers)).includes(value))
        return value;
    else
        return def;
}
export function setTheme(theme) {
    localStorage.setItem("theme", theme);
    document.body.classList[theme == "light" ? "add" : "remove"]("lightTheme");
    document.body.classList[theme == "dark" ? "add" : "remove"]("darkTheme");
    themeIcon.innerText = `${theme}_mode`;
}
export function getURL(input) {
    if (input instanceof Papor)
        return input.url(getSelectedSource("gceguide"));
    else
        return input.url();
}
export function addListeners() {
    errorbox.innerText = "";
    const firstLoad = localStorage.getItem("pasapapor-first-load") === null;
    localStorage.setItem("pasapapor-first-load", "false");
    //When a key is pressed
    pasapaporInput.addEventListener("keydown", (e) => {
        if (!(e instanceof KeyboardEvent))
            impossible();
        if (e.key == "Enter") {
            //If it's enter, open papors
            try {
                errorbox.className = "success";
                errorbox.innerText = "";
                if (pasapaporInput.value.includes("amogus")) {
                    fail("Too sus.");
                }
                else if (/never.*gonna.*give.*you.*up/i.test(pasapaporInput.value)) {
                    window.open(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
                }
                else
                    switch (pasapaporInput.value.toLowerCase()) {
                        case "as":
                        case "a":
                        case "asa":
                        case "as a":
                        case "as/a":
                        case "as / a":
                            buttonAsa.click();
                            pasapaporInput.value = "";
                            break;
                        case "ig":
                        case "i":
                        case "igcse":
                            buttonIgcse.click();
                            pasapaporInput.value = "";
                            break;
                        default:
                            const papors = getPaporFromInput(pasapaporInput.value, getSelectedLevel());
                            if (papors.length == 1)
                                window.open(getURL(papors[0]), "_blank");
                            else {
                                firstUsePopup("allow-popups", `You're trying to open multiple papers at once, but browsers will block this by default to prevent spam.\nInstructions to allow popups: Check the URL bar (left side or right side) for an icon or message that says "Popup blocked", then click it and select "Always allow popups and redirects from..."`, () => {
                                    papors.forEach(papor => window.open(getURL(papor), "_blank"));
                                }, true);
                            }
                            errorbox.innerHTML = `✔ Opened: ${papors.map(papor => `<a href="${getURL(papor)}">${escapeHTML(papor.cleanString())}</a>`).join(", ")}`;
                            break;
                    }
            }
            catch (err) {
                errorbox.className = "error";
                errorbox.innerText = `❗ ${err.message}`;
            }
        }
    });
    window.addEventListener("keydown", e => {
        if (e.key == ";" && e.ctrlKey) {
            pasapaporInput.value = "!$*&U!%# further maths wt5y5hwinter 2022questionpaper22";
            buttonAsa.click();
        }
        else if (e.key == "Enter" && e.target == document.body) {
            //If enter pressed on nothing
            pasapaporInput.select();
        }
    });
    //When the selected level is changed
    buttonAsa.addEventListener("change", () => localStorage.setItem("pasapapor-level", Level.A_LEVELS));
    buttonIgcse.addEventListener("change", () => localStorage.setItem("pasapapor-level", Level.IGCSE));
    buttonSourceGce.addEventListener("change", () => localStorage.setItem("pasapapor-source", "gceguide"));
    buttonSourceXtr.addEventListener("change", () => localStorage.setItem("pasapapor-source", "xtremepapers"));
    //Load saved level
    switch (localStorage.getItem("pasapapor-level")) {
        case Level.A_LEVELS:
            buttonAsa.click();
            break;
        case Level.IGCSE:
            buttonIgcse.click();
            break;
    }
    const savedSource = localStorage.getItem("pasapapor-source");
    if (savedSource != null && savedSource in providers) {
        //TODO fix this... proper config system...
        if (savedSource == "gceguide")
            buttonSourceGce.click();
        else if (savedSource == "xtremepapers")
            buttonSourceXtr.click();
    }
    let flashing = false;
    let bouncing = false;
    let flipped = false;
    let clickTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    headerText.addEventListener("click", e => {
        clickTimes.shift();
        clickTimes.push(Date.now());
        if (e.shiftKey)
            flashing = !flashing;
        if (e.altKey)
            bouncing = !bouncing;
        if (e.ctrlKey)
            flipped = !flipped;
        header.style.setProperty("transform", flipped ? "scaleX(-1)" : "none");
        headerText.style.setProperty("animation-name", bouncing ? "sizebounce" : "none");
        //modifying animation-play-state didn't work as the animation could get paused when the size is high, causing scrollbars to appear
        if (!e.shiftKey && !e.altKey && !e.ctrlKey)
            headerText.style.setProperty('color', `hsl(${Math.floor(Math.random() * 360)}, 80%, 80%)`);
        if (((Date.now() - clickTimes[0]) / 10) < 500)
            header.style.setProperty("visibility", "hidden");
    });
    setInterval(() => {
        if (flashing)
            headerText.style.setProperty('color', `hsl(${Math.floor(Math.random() * 360)}, 80%, 80%)`);
    }, 500);
    pasapaporInput.focus();
    pasapaporInput.select();
    Array.from(document.getElementsByClassName("hide-first-load")).forEach(el => {
        if (firstLoad)
            el.addEventListener("click", () => {
                el.classList.remove("hide-first-load");
            });
        else
            el.classList.remove("hide-first-load");
    });
    infoHoverSpans[0].onmouseenter = infoHoverSpans[0].onclick = () => {
        hoverInfo.style.color = "var(--a1)";
        hoverInfo.innerText = `the 4 digit subject code, or name`;
    };
    infoHoverSpans[1].onmouseenter = infoHoverSpans[1].onclick = () => {
        hoverInfo.style.color = "var(--a2)";
        hoverInfo.innerText = `the season followed by the last two digits of the year, like this: "w21"`;
    };
    infoHoverSpans[2].onmouseenter = infoHoverSpans[2].onclick = () => {
        hoverInfo.style.color = "var(--a3)";
        hoverInfo.innerText = `"qp", "ms", etc. If omitted, both qp and ms will be opened.`;
    };
    infoHoverSpans[3].onmouseenter = infoHoverSpans[3].onclick = () => {
        hoverInfo.style.color = "var(--a4)";
        hoverInfo.innerText = `the 2 digit component code, like "21"`;
    };
    if (window.innerWidth < 600) {
        hoverInfo.innerText = "Tap for more info";
    }
    // infoHoverSpans.forEach(span => span.addEventListener("mouseleave", () => {
    // 	hoverInfo.style.color = "unset";
    // 	hoverInfo.innerText = `Hover for more information`;
    // }));
    switch (localStorage.getItem("theme")) {
        case "dark":
            setTheme("dark");
            break;
        case "light":
            setTheme("light");
            break;
        case null:
            setTheme("dark");
            break;
        default:
            console.warn(`Invalid theme ${localStorage.getItem("theme")}`);
            setTheme("dark");
            break;
    }
    themeButton.addEventListener("click", () => {
        if (localStorage.getItem("theme") == "light")
            setTheme("dark");
        else if (localStorage.getItem("theme") == "dark")
            setTheme("light");
        else {
            console.warn("Theme is invalid");
            setTheme("dark");
        }
    });
}
;
