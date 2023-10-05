/**
 * Copyright © BalaM314, 2023. MIT License.
 */


//HTML elements
const pasapaporInput = getElement("#pasapapor-select", HTMLInputElement);
const levelSelectDiv = getElement("#level-select", HTMLDivElement);
const buttonIgcse = getElement("input#igcse", HTMLInputElement);
const buttonAsa = getElement("input#as-a", HTMLInputElement);
const errorbox = getElement("#errorbox", HTMLDivElement);
const headerText = getElement("#header-text", HTMLSpanElement);
const header = getElement("#header", HTMLDivElement);
const formatExplanation = getElement("#format-explanation", HTMLDivElement);
const hoverInfo = getElement("#hover-info", HTMLDivElement);
const infoHoverSpans = Array.from(formatExplanation.children) as HTMLSpanElement[];

const now = new Date;
const isAprilFools = (now.getDate() == 1 && now.getMonth() == 4);

enum Level {
	IGCSE = "Cambridge IGCSE",
	A_LEVELS = "A Levels"
}

const openedPapers = {
	lsKey: "pasapapor-openedpapers",
	storage: {} as Record<string, {
		status: "complete" | "partial";
		dateUpdated: Date;
	}>,
	load(){
		const data = localStorage.getItem(this.lsKey);
		if(data){
			function fail(message:string):never {
				throw new Error(message);
			}
			try {
				const dataObj = JSON.parse(data);
				if(typeof dataObj != "object" || dataObj == null) fail("invalid json");
				for(const [k, v] of Object.entries(dataObj as Record<string, unknown>)){
					if(!/(\d{4})_([msw]\d{2})_(\d{2})/.test(k)) fail(`invalid key ${k}`);
					if(typeof v != "object" || v == null) fail("invalid json");
					if(!("status" in v && ["complete", "partial"].includes(v.status as any) && "dateUpdated" in v && typeof v.dateUpdated == "number")) fail("bad data");
					this.storage[k] = {
						status: v.status,
						dateUpdated: new Date(v.dateUpdated)
					} as any;
				}
			} catch(err){
				console.error(err);
				localStorage.setItem(`${this.lsKey}-invalid-${Date.now()}`, data);
				localStorage.removeItem(this.lsKey);
			}
		}
	},
	save(){
		localStorage.setItem(this.lsKey, JSON.stringify(this.storage, (k, v) => {
			if(k == "dateUpdated" && v instanceof Date) return v.getTime();
			else return v;
		}));
	}
};

//Data
const otherDocuments: {
	[index:string]: Openable
} = (d => Object.fromEntries(
	d.map(([url, ...names]) =>
		names.map(name => [name.replaceAll(" ", ""), {url: () => url, cleanString: () => name}] as const)
	).flat(1)
))([
	["https://www.cambridgeinternational.org/images/423525-list-of-formulae-and-statistical-tables.pdf", "mf9", "mf09", "math mf9", "math mf09"],
	["https://www.cambridgeinternational.org/Images/417318-list-of-formulae-and-statistical-tables.pdf", "mf19", "math mf19"],
	["https://papers.gceguide.com/A%20Levels/Mathematics%20-%20Further%20(9231)/Other%20Resources/MF10.pdf", "mf10", "math mf10"],
	["https://www.cambridgeinternational.org/images/344616-list-of-formulae-and-statistical-tables.pdf", "mf20", "math mf20"],
	["https://www.seab.gov.sg/content/syllabus/alevel/2017Syllabus/ListMF26.pdf", "mf26", "math mf26"],
	["https://www.cambridgeinternational.org/Images/164870-2016-specimen-data-booklet.pdf", "db", "chem db", "data booklet", "chem data booklet", "chemistry data booklet", "9701 db"]
]);


//JSON.stringify(Object.fromEntries(Array.from(temp0.children).map(el => [el.innerText.match(/\((\d+)\)/)?.[1], el.innerText]).filter(([id, text]) => id != undefined)));
const rawSubjectData: {
	[L in Level]: [id:string, name:string][];
} = {
	[Level.IGCSE]: [["0452","Accounting (0452)"],["0985","Accounting (9-1) (0985)"],["0548","Afrikaans - Second Language (0548)"],["0600","Agriculture (0600)"],["0508","Arabic - First Language (0508)"],["7184","Arabic - First Language (9-1) (7184)"],["0544","Arabic - Foreign Language (0544)"],["0400","Art & Design (0400)"],["0989","Art & Design (9-1) (0989)"],["0538","Bahasa Indonesia (0538)"],["0610","Biology (0610)"],["0970","Biology (9-1) (0970)"],["0450","Business Studies (0450)"],["0986","Business Studies (9-1) (0986)"],["0620","Chemistry (0620)"],["0971","Chemistry (9-1) (0971)"],["0547","Chinese (Mandarin) - Foreign Language (0547)"],["0509","Chinese - First Language (0509)"],["0523","Chinese - Second Language (0523)"],["0478","Computer Science (0478)"],["0984","Computer Science (9-1) (0984)"],["0420","Computer Studies (0420)"],["0445","Design & Technology (0445)"],["0979","Design & Technology (9-1) (0979)"],["0453","Development Studies (0453)"],["0411","Drama (0411)"],["0994","Drama (9-1) (0994)"],["0515","Dutch - Foreign Language (0515)"],["0455","Economics (0455)"],["0987","Economics (9-1) (0987)"],["0500","English - First Language (0500)"],["0990","English - First Language (9-1) (0990)"],["0627","English - First Language (9-1) (UK only) (0627)"],["0522","English - First Language (UK) (0522)"],["0524","English - First Language (US) (0524)"],["0486","English - Literature (0486)"],["0477","English - Literature (9-1) (UK only) (0477)"],["0427","English - Literature (US) (0427)"],["0475","English - Literature in English (0475)"],["0992","English - Literature in English (9-1) (0992)"],["0991","English - Second Language (9-1) (0991)"],["0511","English as a Second Language (Count-in speaking) (0511)"],["0510","English as a Second Language (Speaking endorsement) (0510)"],["0993","English as a Second Language (Speaking endorsement) (9-1) (0993)"],["0454","Enterprise (0454)"],["0680","Environmental Management (0680)"],["0648","Food & Nutrition (0648)"],["7156","French (9-1) (7156)"],["0501","French - First Language (0501)"],["0520","French - Foreign Language (0520)"],["0460","Geography (0460)"],["0976","Geography (9-1) (0976)"],["7159","German (9-1) (7159)"],["0505","German - First Language (0505)"],["0525","German - Foreign Language (0525)"],["0457","Global Perspectives (0457)"],["0549","Hindi as a Second Language (0549)"],["0470","History (0470)"],["0977","History (9-1) (0977)"],["0409","History - American (US) (0409)"],["0447","India Studies (0447)"],["0417","Information and Communication Technology (0417)"],["0983","Information and Communication Technology (9-1) (0983)"],["0531","IsiZulu as a Second Language (0531)"],["0493","Islamiyat (0493)"],["7164","Italian (9-1) (7164)"],["0535","Italian - Foreign Language (0535)"],["0480","Latin (0480)"],["0696","Malay - First Language (0696)"],["0546","Malay - Foreign Language (0546)"],["0697","Marine Science (0697)"],["0697","Marine Science (Maldives only) (0697)"],["0580","Mathematics (0580)"],["0980","Mathematics (9-1) (0980)"],["0444","Mathematics (US) (0444)"],["0606","Mathematics - Additional (0606)"],["0607","Mathematics - International (0607)"],["0410","Music (0410)"],["0978","Music (9-1) (0978)"],["0448","Pakistan Studies (0448)"],["0413","Physical Education (0413)"],["0995","Physical Education (9-1) (0995)"],["0652","Physical Science (0652)"],["0625","Physics (0625)"],["0972","Physics (9-1) (0972)"],["0504","Portuguese - First Language (0504)"],["0490","Religious Studies (0490)"],["0499","Sanskrit (0499)"],["0653","Science - Combined (0653)"],["0973","Sciences - Co-ordinated (9-1) (0973)"],["0654","Sciences - Co-ordinated (Double) (0654)"],["0495","Sociology (0495)"],["7160","Spanish (9-1) (7160)"],["0502","Spanish - First Language (0502)"],["0530","Spanish - Foreign Language (0530)"],["0488","Spanish - Literature (0488)"],["0262","Swahili (0262)"],["0518","Thai - First Language (0518)"],["0471","Travel & Tourism (0471)"],["0513","Turkish - First Language (0513)"],["0539","Urdu as a Second Language (0539)"],["0408","World Literature (0408)"]],
	[Level.A_LEVELS]: [["9706","Accounting (9706)"],["9679","Afrikaans (9679)"],["8779","Afrikaans - First Language (AS Level only) (8779)"],["8679","Afrikaans - Language (AS Level only) (8679)"],["9713","Applied Information and Communication Technology (9713)"],["9680","Arabic (9680)"],["8680","Arabic - Language (AS Level only) (8680)"],["9479","Art & Design (9479)"],["9704","Art & Design (9704)"],["9700","Biology (9700)"],["9609","Business (9609)"],["9707","Business Studies (9707)"],["9980","Cambridge International Project Qualification (9980)"],["9701","Chemistry (9701)"],["9715","Chinese (A Level only) (9715)"],["8681","Chinese - Language (AS Level only) (8681)"],["9274","Classical Studies (9274)"],["9608","Computer Science (for final examination in 2021) (9608)"],["9618","Computer Science (for first examination in 2021) (9618)"],["9691","Computing (9691)"],["9631","Design & Textiles (9631)"],["9705","Design and Technology (9705)"],["9481","Digital Media & Design (9481)"],["9011","Divinity (9011)"],["8041","Divinity (AS Level only) (8041)"],["9482","Drama (9482)"],["9708","Economics (9708)"],["9093","English - Language AS and A Level (9093)"],["8695","English - Language and Literature (AS Level only) (8695)"],["9695","English - Literature (9695)"],["8021","English General Paper (AS Level only) (8021)"],["8291","Environmental Management (AS only) (8291)"],["9336","Food Studies (9336)"],["9716","French (A Level only) (9716)"],["8682","French - Language (AS Level only) (8682)"],["8670","French - Literature (AS Level only) (8670)"],["8001","General Paper 8001 (AS Level only) (8001)"],["8004","General Paper 8004 (AS Level only) (8004)"],["9696","Geography (9696)"],["9717","German (A Level only) (9717)"],["8683","German - Language (AS Level only) (8683)"],["9239","Global Perspectives & Research (9239)"],["9687","Hindi (A Level only) (9687)"],["8687","Hindi - Language (AS Level only) (8687)"],["8675","Hindi - Literature (AS Level only) (8675)"],["9014","Hinduism (9014)"],["9487","Hinduism (9487)"],["8058","Hinduism (AS level only) (8058)"],["9489","History (9489)"],["9389","History (for final examination in 2021) (9389)"],["9626","Information Technology (9626)"],["9488","Islamic Studies (9488)"],["9013","Islamic Studies (9013 & 8053)"],["8053","Islamic Studies (9013 & 8053)"],["8281","Japanese Language (AS Level only) (8281)"],["9084","Law (9084)"],["9693","Marine Science (9693)"],["9709","Mathematics (9709)"],["9231","Mathematics - Further (9231)"],["9607","Media Studies (9607)"],["9483","Music (9483)"],["9703","Music (9703)"],["8663","Music (AS Level only) (8663)"],["8024","Nepal Studies (AS Level only) (8024)"],["9396","Physical Education (9396)"],["9702","Physics (9702)"],["9718","Portuguese (A Level only) (9718)"],["8684","Portuguese - Language (AS Level only) (8684)"],["8672","Portuguese - Literature (AS Level only) (8672)"],["9698","Psychology (9698)"],["9990","Psychology (9990)"],["9699","Sociology (9699)"],["9719","Spanish (A Level only) (9719)"],["8665","Spanish - First Language (AS Level only) (8665)"],["8685","Spanish - Language (AS Level only) (8685)"],["8673","Spanish - Literature (AS Level only) (8673)"],["9689","Tamil (9689)"],["8689","Tamil - Language (AS Level only) (8689)"],["9694","Thinking Skills (9694)"],["9395","Travel & Tourism (9395)"],["9676","Urdu (A Level only) (9676)"],["8686","Urdu - Language (AS Level only) (8686)"],["9686","Urdu - Pakistan only (A Level only) (9686)"]]
};
const subjectMapping:SubjectMapping = Object.fromEntries([
	...rawSubjectData[Level.IGCSE]
		.map(([id, name]) => ([id, {
			level: Level.IGCSE,
			name
		}])),
	...rawSubjectData[Level.A_LEVELS]
		.map(([id, name]) => ([id, {
			level: Level.A_LEVELS,
			name
		}])),
]);
const syllabusData:Record<string, string[]> = {"8021":["557265-2022-2024","664519-2025-2027"],"8022":["635236-2024-2026"],"8027":["663716-2025-2027"],"8028":["664288-2025-2027"],"8238":["635239-2024-2026"],"8281":["597284-2023"],"8291":["557262-2022-2024","664522-2025-2027"],"8386":["635241-2024-2026"],"8665":["597291-2023"],"8673":["597365-2023"],"8675":["597294-2023"],"8679":["597297-2023-2024","664524-2025-2026"],"8680":["597350-2023-2024","664527-2025"],"8681":["597353-2023"],"8682":["597356-2023","635867-2024"],"8683":["https://www.cambridgeinternational.org/Images/597359-2023-2024-syllabus-.pdf"],"8684":["597362-2023","635874-2024","664529-2025"],"8685":["597365-2023"],"8686":["597371-2023","635890-2024","664531-2025-2026"],"8687":["597375-2023"],"8689":["597378-2023","635894-2024-2025"],"8695":["502929-2021-2023","635896-2024-2026"],"9084":["595453-2023-2025"],"9093":["502932-2021-2023","635901-2024-2026"],"9231":["597381-2023-2025"],"9239":["595455-2023-2025"],"9274":["557256-2022-2024","664534-2025-2027"],"9395":["597384-2023","634457-2024-2026"],"9396":["597683-2023"],"9479":["557248-2022-2024","664536-2025"],"9481":["557245-2022-2024","664544-2025"],"9482":["554592-2021-2023","635919-2024-2026"],"9483":["557243-2022-2024","664546-2025-2026"],"9484":["596449-2023","636040-2024-2026"],"9487":["521992-2021-2023","636056-2024-2025"],"9488":["502933-2021-2023","636058-2024-2026"],"9489":["502955-2021-2023","636122-2024-2025"],"9607":["502957-2021-2023","636087-2024-2026"],"9609":["595459-2023-2025"],"9618":["502962-2021-2023","636089-2024-2025"],"9626":["554602-2022-2024","662482-2025-2027"],"9631":["557238-2022-2023"],"9676":["597387-2023","636091-2024"],"9680":["597390-2023-2024","664549-2025"],"9686":["597395-2023","636093-2024","664551-2025-2026"],"9687":["597402-2023"],"9689":["597409-2023","636095-2024-2025"],"9693":["554604-2022-2024","664553-2025-2027"],"9694":["597412-2023-2025"],"9695":["502967-2021-2023","636097-2024-2026"],"9696":["597415-2023-2024","664556-2025-2026"],"9699":["502972-2021-2023","636099-2024-2026"],"9700":["554607-2022-2024","664560-2025-2027"],"9701":["554616-2022-2024","664563-2025-2027"],"9702":["554625-2022-2024","664565-2025-2027"],"9705":["597418-2023","651351-2024","675267-2025-2027"],"9706":["595461-2023-2025"],"9708":["595463-2023-2025"],"9709":["597421-2023-2025"],"9715":["597423-2023"],"9716":["597426-2023","636101-2024"],"9717":["597429-2023-2024"],"9718":["597432-2023","636103-2024","664567-2025"],"9719":["597443-2023"],"9844":["649879-2024-2026"],"9868":["649875-2024-2026"],"9897":["664366-2025-2027"],"9898":["664368-2025-2027"],"9990":["502977-2021-2023","634461-2024-2026"]};
const shorthandSubjectNames = ((data:{
	[L in Level]: {
		[id:string]: string[];
	}
}) => Object.fromEntries(
	Object.entries(data).map(
		([l,d]) => [l, Object.fromEntries(
			new Array<[string, string]>().concat(
				...Object.entries(d).map(([id, shorthands]) => shorthands.map(s => [s, id] as [string, string]))
			)
		)]
	)
))({
	[Level.IGCSE]: {
		"0580": ["math", "mathematics"],
		"0620": ["chem", "chemistry"],
		"0625": ["phy", "phys", "physics"],
		"0478": ["cs", "compsci"],
		"0610": ["bio", "biology"],
		"0455": ["eco", "economics"],
		"0500": ["eng", "english", "el"],
		"0606": ["meth", "add math", "addmath"]
	},
	[Level.A_LEVELS]: {
		"9700": ["bio", "biology"],
		"9701": ["chem", "chemistry"],
		"9702": ["phy", "phys", "physics"],
		"9708": ["eco"],
		"9709": ["math", "mathematics"],
		"9093": ["eng", "english", "el"],
		"8021": ["ge", "eg", "egp"],
		"9618": ["cs", "compsci"],
		"9231": ["further math", "f math", "fmath", "math f", "mathf", "math further", "meth"],
		"9990": ["psy", "psych", "psycho", "psychology"],
	},
});

interface Openable {
	url(): string;
	cleanString(): string;
}

/** Represents a pasapapor. */
class Papor implements Openable {
	year: string;
	name: string;
	level: Level;
	constructor(public subjectID:string, public season:string, public type:string, public code?:string){
		this.year = `20${season.slice(1)}`;
		const data = subjectMapping[subjectID] ?? (() => {throw new Error(`Invalid subject id "${subjectID}"`);})();
		this.name = data.name;
		this.level = data.level;
	}
	url(){
		const filetype = this.type == "sf" ? "zip" : "pdf";
		return this.code ?
			`https://papers.gceguide.com/${this.level}/${this.name}/${this.year}/${this.subjectID}_${this.season}_${this.type}_${this.code}.${filetype}` : 
			`https://papers.gceguide.com/${this.level}/${this.name}/${this.year}/${this.subjectID}_${this.season}_${this.type}.${filetype}`
	}
	toString(){
		return `Papor{ ${this.subjectID}_${this.season}_${this.type}_${this.code} }`;
	}
	cleanString(){
		if(this.code){
			return `${this.subjectID}_${this.season}_${this.type}_${this.code}`;
		} else {
			return `${this.subjectID}_${this.season}_${this.type}`;
		}
	}
	shortString(){
		if(this.code){
			return `${this.subjectID}_${this.season}_${this.code}`;
		} else return null;
	}
}


function getSyllabusLink(code:string, specifier:string | undefined | null):string {	
	if(!(code in syllabusData)) throw new Error(`Syllabus unknown for subject id ${code}`);
	const fragments = syllabusData[code];
	let fragment;
	if(!specifier) fragment = fragments[0];
	else if(specifier.length == 1) fragment = fragments[+specifier - 1];
	else if(specifier.length == 2) fragment = fragments.find(f => f.includes(`-20${specifier}`));
	else if(specifier.length == 4) fragment = fragments.find(f => f.includes(`-${specifier}`));
	else if(specifier.length == 5) fragment = fragments.find(f => f.includes(`-20${specifier.split("-")[0]}-20${specifier.split("-")[1]}`));
	else if(specifier.length == 9) fragment = fragments.find(f => f.includes(`-${specifier}`));
	fragment ??= fragments[0];
	return fragment.startsWith("https://") ? fragment : `https://www.cambridgeinternational.org/Images/${fragment}-syllabus.pdf`;
	//necessary because cambridge typo'd the syllabus for german
}


/** Gets an HTML element of a particular type. */
function getElement<T extends typeof Element>(selector:string, type:T):T["prototype"] {
	const elements = Array.from(document.querySelectorAll(selector))
		.filter((e):e is T["prototype"] => e instanceof type);
	if(elements[0]) return elements[0];
	if(document.querySelectorAll(selector).length > 1) throw new Error(`No elements matching ${selector} were of type ${type.name}`);
	else if(document.querySelector(selector)) throw new Error(`Element matching ${selector} was of type ${document.querySelector(selector)!.constructor.name}, not ${type.name}`);
	else throw new Error(`No elements matched selector ${selector}`);
}

/**
 * Helper function to display a popup on first use of a feature. Do not overuse as getting spammed with alert() is annoying.
 * @param key Gets "pasapapor-" prepended to it.
 * @param message Message displayed in the alert box.
 * @param callback Called if it is not the first use.
 */
function firstUsePopup(key:string, message:string, callback?:() => unknown, runCallbackAfterMessage = false){
	const lsKey = `pasapapor-${key}`;
	if(localStorage.getItem(lsKey) != null){
		callback?.();
	} else {
		alert(message);
		localStorage.setItem(lsKey, "true");
		if(runCallbackAfterMessage) callback?.();
	}
}

/** Guesses a subject based on input. */
function guessData(name:string, level:Level | null):[string, SubjectData][] {
	return Object.entries(subjectMapping)
		.filter(
			([id, data]) =>
				(level == null || data.level == level) &&
				data.name.toLowerCase().replaceAll(/[()\-&]/g, "").replaceAll(/ +/g, " ").includes(name.toLowerCase())
		);
}

/** Validates a season, correcting it if it is "f22" or "w9". */
function validateSeason(season:string):string | null {
	const matchData = season.match(/^([a-z])(\d{1}|\d{2}|\d{4})$/i);
	if(matchData == null) return null;
	let [, seasonChar, year] = matchData;
	let processedSeason:string;
	let processedYear:string;
	if(year.length == 1){
		processedYear = "0" + year;
	} else if(year.length == 4){
		processedYear = year.slice(2);
	} else {
		processedYear = year;
	}
	switch(seasonChar){
		case "m": case "f":
			processedSeason = "m"; break;
		case "j": case "s":
			processedSeason = "s"; break;
		case "w": case "o": case "n":
			processedSeason = "w"; break;
		default:
			return null;
	}
	return processedSeason + processedYear;
}

/** Gets the subject id from entered string name. Throws if too many or no results. */
function getIDFromName(name:string, level:Level | null):string {
	if(level == null){
		const aLevelGuess = shorthandSubjectNames[Level.A_LEVELS][name.toLowerCase()];
		const igcseGuess = shorthandSubjectNames[Level.IGCSE][name.toLowerCase()];
		if(aLevelGuess && igcseGuess) throw new Error(`Subject "${name}" could refer to either IGCSE or A Levels. Please specify using the radio buttons.`);
		if(aLevelGuess) return aLevelGuess;
		if(igcseGuess) return igcseGuess;
	} else {
		if(shorthandSubjectNames[level][name.toLowerCase()]) return shorthandSubjectNames[level][name.toLowerCase()];
	}
	const guesses = guessData(name, level);
	if(guesses.length == 1) return guesses[0][0];
	if(guesses.length == 0) throw new Error(`Unknown subject "${name}".`);
	if(guesses.length <= 5) throw new Error(`Ambiguous subject "${name}". Did you mean ${guesses.map(guess => `"${guess[1].name}"`).join(" or ")}?${level == null ? " Specifying the level with the radio buttons may help." : ""}`);
	throw new Error(`Ambiguous subject "${name}".`);
}

function getSelectedLevel():Level | null {
	const value = Array.from(levelSelectDiv.children).filter((el):el is HTMLInputElement => el instanceof HTMLInputElement && el.checked)[0]?.value;
	if(value == "igcse") return Level.IGCSE;
	if(value == "as/a") return Level.A_LEVELS;
	else return null;
}

function isTypeValid(subjectID:string, type:string, code:string | undefined):boolean {
	switch(type){
		case "qp": case "ms": return true; //QP and MS exist for all subjects in almost all codes
		case "er": case "gt": return code == undefined; //ER is for every component
		case "ci": return !! ( //confidential instructions, exists for all science practicals
			["9700","9701","9702"].includes(subjectID) && code?.match(/^3[1-6]$/) ||
			["9700","9701","9702"].includes(subjectID) && code?.match(/^3[1-6]$/) ||
			["0610","0970","0620","0971","0625","0972","0652","0973","0654"].includes(subjectID) && code?.match(/^5[1-3]$/)
		);
		case "sf": return !! ( //source files, cs and ict
			["9608","9618"].includes(subjectID) && code?.match(/^4[1-3]$/) ||
			["0417","0983"].includes(subjectID) && code?.match(/^[2-3][1-3]$/)
		);
		//case "in": return ["9706","9679","8679","9680","8680","9479","9609","9715","8681"].includes(subjectID); //Too many things have insert
		case "ir": return true;
		case "pm": return !! (//Prerelease material, only valid for some CS subjects
			["9608"].includes(subjectID) && code?.match(/^[24][1-3]$/) ||
			["0984","0478"].includes(subjectID) && code?.match(/^2[1-3]$/)
		);
		default: return true;
	}
}

function resolveSeasonChar(seasonString:string):'m' | 's' | 'w' | null {
	switch(seasonString){
		case "spring": case "feb": case "march": case "mar": case "m": case "f":
			return "m";
		case "summer": case "may": case "june": case "jun": case "j": case "s":
			return "s";
		case "winter": case "october": case "november": case "oct": case "nov": case "w": case "o": case "n":
			return "w";
		default: return null;
	}
}

function never():never {throw new Error("code failed");}

function removeMatch(string:string, match:RegExpMatchArray, replacement = ""){
	return string.slice(0, match.index!) + replacement + string.slice(match.index! + match[0].length);
}

function smartParseInput(input:string, level:Level | null):Openable[] {
	//List of things that the input could mean:
	//Document such as mf19 or chem db
	//Syllabus
	//Pasapapor
	//Pasapapor with type omitted indicating QP and MS
	//Grade threshold or examiner report

	//4 digit numbers could mean either a year or a subject code; use the first 2 digits of the number to decide.
	//2 digit numbers can mean either a year or a component code; parse [a-z]23 as a year, but 23 by itself is ambiguous. Possibly use positioning?
	//"s" without numbers directly after means syllabus
	//Some people might specify the season char and the year separately like "summer 2022"
	//Years like "22" cannot be accepted as it might also mean component 22
	//so if separate, year must be a 4 digit year
	input = input.toLowerCase();
	
	//Check for documents
	const cleanedInput = input.replace(/[ \-_\/]/g, "");
	if(cleanedInput in otherDocuments){
		console.log(`Input matched otherdocument`);
		return [otherDocuments[cleanedInput]];
	}

	let
		syllabus:boolean = false,
		year:string | null = null,
		seasonChar:'m' | 's' | 'w' | null = null,
		subjectCode:string | null = null,
		componentCode:string | null = null,
		componentType:string | null = null,
		syllabusRawYearSpecifier:string | null = null
	;

	//TODO: attempt to search for each component multiple times, with progressively decreasing strictness

	//Attempt to find season
	const x00Match = input.match(/(spring|feb|march|mar|f|m|summer|may|june|jun|s|j|winter|october|november|oct|nov|w|o|n)(20\d\d|\d\d|\d)(?!\d{2,3}(?:\D|$))/);
	//Negative lookbehind (?<![a-z]) could be used to not match strings such as phy(s20), but 
	//4 digit year: restricted to 20xx to match s2022 but not s9702 (should be parsed as "syllabus" "9702") (no subject codes start with 20)
	//Negative lookahead used to match s209701 but not s9702
	if(x00Match){
		const [, _season, _year] = x00Match;
		const char = resolveSeasonChar(_season);
		if(char) seasonChar = char;
		else never();
		//Set the year
		if(_year.length == 1) year = "0" + _year; //9 -> 09
		else if(_year.length == 2) year = _year; //23 -> 23, no changes necessary
		else if(_year.length == 4) year = _year.slice(2); //2023 -> 23
		else never();
		input = removeMatch(input, x00Match, "@");
		console.log(`Found season and year: "${x00Match[0]}"`);
	} else {
		const xy00Match = input.match(/(f\/m|m\/j|o\/n)\/(\d\d)/);
		if(xy00Match){
			const [, _season, _year] = xy00Match;
			if(_season == "f/m") seasonChar = "m";
			else if(_season == "m/j") seasonChar = "s";
			else if(_season == "o/n") seasonChar = "w";
			else never();
			year = _year;
			input = removeMatch(input, xy00Match, "@");
			console.log(`Found season and year: "${xy00Match[0]}" -> ${seasonChar}${year}`);
		} else console.log(`Unable to find season and year`);
	}

	//Search for syllabus
	const syllabusMatch = input.match(/(?<![a-z])(s|syl|syll|syllabus)(?![a-z])/); //\b does not work because it thinks _ is a word
	if(syllabusMatch){
		syllabus = true;
		input = removeMatch(input, syllabusMatch, "@");
		//Look for well-demarcated syllabus raw year specifier (only accepts hyphens to separate years)
		const rawYearSpecifierMatch = input.match(/(?<=[ \-_\/]|^)(\d|20\d\d|\d\d-\d\d|20\d\d-20\d\d)(?=[ \-_\/]|$)/);
		if(rawYearSpecifierMatch) [, syllabusRawYearSpecifier] = rawYearSpecifierMatch;
		console.log(`Syllabus: specified: "${syllabusMatch[0]}"`);
	} else console.log(`Syllabus: not specified`);

	//Search for component code
	const componentCodeMatch = input.match(/(?<!\d)(\d{2})(?!\d)/);
	if(componentCodeMatch){
		[, componentCode] = componentCodeMatch;
		componentCodeMatch.
		input = removeMatch(input, componentCodeMatch, "@");
		console.log(`Found component code: "${componentCodeMatch[0]}"`);
	} else console.log(`Unable to find component code`);

	//Search for component type
	const componentTypeMatch = input.match(/(?<![a-z])(ci|er|gt|ms|qp|in|sf|ir|pm)(?![a-z])/);
	if(componentTypeMatch){
		[, componentType] = componentTypeMatch;
		input = removeMatch(input, componentTypeMatch, "@");
		console.log(`Found component type: "${componentTypeMatch[0]}"`);
	} else {
		//Search for expanded component type
		const expandedComponentTypeMatch = input.match(/(confidential[ \-_\/]*?instructions?)|(examiner[ \-_\/]*?report)|(grade[ \-_\/]*?thresholds)|(marking[ \-_\/]*?scheme)|(question[ \-_\/]*?paper)|(insert)|(source[ \-_\/]*?files?)|(information[ \-_\/]*?report)|(pre[ \-_\/]*?release[ \-_\/]*?materials)/);
		if(expandedComponentTypeMatch){
			const [, ci, er, gt, ms, qp, _in, sf, ir, pm] = expandedComponentTypeMatch;
			componentType =
				ci ? "ci" :
				er ? "er" :
				gt ? "gt" :
				ms ? "ms" :
				qp ? "qp" :
				_in ? "in" :
				sf ? "sf" :
				ir ? "ir" :
				pm ? "pm" : never();
			input = removeMatch(input, expandedComponentTypeMatch, "@");
			console.log(`Found expanded component type: "${expandedComponentTypeMatch[0]}"`);
		} else console.log(`Unable to find component type`);
	}

	//Search for subject code
	const subjectCodeMatch = input.match(/([0789]\d\d\d)/);
	if(subjectCodeMatch){
		[, subjectCode] = subjectCodeMatch;
		input = removeMatch(input, subjectCodeMatch, "@");
		console.log(`Found subject code: "${subjectCodeMatch[0]}"`);
	} else console.log(`Unable to find subject code`);

	//If season is unknown, try again with looser search, and after sections of the input have been removed
	if(seasonChar == null || year == null){
		const yearMatch = input.match(/20(\d\d)/);
		if(yearMatch){
			year = yearMatch[1];
			input = removeMatch(input, yearMatch, "@");
			console.log(`Found year with looser search: "${yearMatch[0]}"`);
		} else console.log(`Unable to find year with looser search`);
		//Either any of the words, or any of the characters that do not have letters immediately before or after (that means we matched a random letter in a longer word)
		const seasonMatch = input.match(/(spring|feb|march|mar|summer|may|june|jun|winter|october|november|oct|nov)|((?<![a-z])[fmsjwon](?![a-z]))/);
		if(seasonMatch){
			const char = resolveSeasonChar(seasonMatch[0]);
			if(char == null) never();
			seasonChar = char;
			input = removeMatch(input, seasonMatch, "@");
			console.log(`Found season with looser search: "${seasonMatch[0]}"`);
		} else console.log(`Unable to find season with looser search`);
	}

	let remainingStrings;
	let subjectErrorMessages = new Set<string>; //very cursed but it works
	if(subjectCode == null){
		console.log(`Parsing remaining input to find subject code <<${input}>>`);
		remainingStrings = input.match(/[a-z ]*[a-z][a-z ]*/g) ?? []; //this regex is probably O(n^2) or worse
		//TODO handle stuff like further___math
		//TODO duped code here
		for(const str of remainingStrings){
			if(str.trim() == "" || ["the", "to", "and", "for", "he", "his", "me", "no", "them", "first", "us", "paper"].includes(str.trim())) continue;
			try {
				console.log(`Checking <<${str.trim()}>>`);
				subjectCode = getIDFromName(str.trim(), level);
				console.log(`Found subject code ${subjectCode}`);
				break;
			} catch(err){
				subjectErrorMessages.add((err as Error).message);
			}
		}
		console.log(`Parsing remaining input again but with different splitting logic`);
		if(subjectCode == null){
			//Try a different match
			remainingStrings = input.match(/[a-z]+/g) ?? [];
			for(const str of remainingStrings){
				if(str.trim() == "" || ["the", "to", "and", "for", "he", "his", "me", "no", "them", "first", "us", "paper"].includes(str.trim())) continue;
				try {
					console.log(`Checking <<${str.trim()}>>`);
					subjectCode = getIDFromName(str.trim(), level);
					console.log(`Found subject code ${subjectCode}`);
					break;
				} catch(err){
					subjectErrorMessages.add((err as Error).message);
				}
			}
		}
	}
	
	console.log(`Parsed information: `, {
		syllabus, year, seasonChar, subjectID: subjectCode, componentCode, componentType,
		remainingInput: input, remainingStrings
	});
	console.log(`Attempting to find a type to open`);

	if(subjectCode != null && seasonChar != null && year != null && componentType != null && componentCode != null){
		if(componentType && !isTypeValid(subjectCode, componentType, componentCode))
			throw new Error(`Type ${componentType} is not a valid type for component ${subjectCode}/${componentCode}`);
		console.log(`Chunks matched pattern: regular`);
		return [new Papor(subjectCode, `${seasonChar}${year}`, componentType, componentCode)];
	} else if(subjectCode != null && seasonChar != null && year != null && componentType == null && componentCode != null){
		console.log(`Chunks matched pattern: typeOmitted`);
		return [
			new Papor(subjectCode, `${seasonChar}${year}`, "qp", componentCode),
			new Papor(subjectCode, `${seasonChar}${year}`, "ms", componentCode),
		];
	} else if(subjectCode != null && seasonChar != null && year != null && (componentType == "er" || componentType == "gt") && componentCode == null){
		console.log(`Chunks matched pattern: codeOmitted`);
		return [new Papor(subjectCode, `${seasonChar}${year}`, componentType)];
	} else if(syllabus == true && subjectCode != null){
		if(syllabusRawYearSpecifier == null){
			//Try to get it by parsing the remaining input
			const rawYearSpecifierMatch = input.match(/20\d\d-20\d\d|\d\d-\d\d|20\d\d|\d\d|\d/);
			if(rawYearSpecifierMatch) [, syllabusRawYearSpecifier] = rawYearSpecifierMatch;
		}
		const link = getSyllabusLink(subjectCode, syllabusRawYearSpecifier);
		console.log(`Chunks matched pattern: syllabus`);
		return [{url: () => link, cleanString: () => `${subjectCode} syllabus`}];
	} else {
		//Try to guess what the user was trying to do
		//Syllabus requires a very minimal amount of info (subject and a phrase implying syllabus, such as "s" or "syl"), so do that last
		console.log(`Chunks did not match any pattern, erroring`);
		if(subjectCode != null && componentType != null && componentCode != null){ //missing season
			throw new Error(`It looks like you're trying to open a paper (${subjectCode} ${componentType} ${componentCode}). If you are, please specify the year and season, like this: (${subjectCode} s22 ${componentType} ${componentCode})`);
		} else if(subjectCode != null && seasonChar != null && year != null && componentType != null){ //missing component code
			throw new Error(`It looks like you're trying to open a paper (${subjectCode} ${seasonChar}${year} ${componentType}). If you are, please specify the component code, like this: (${subjectCode} ${seasonChar}${year} ${componentType} 12). You can only omit the component code if you're trying to open something that doesnt have a code, such as the grade thresholds (${subjectCode} ${seasonChar}${year} gt) or the examiner report (${subjectCode} ${seasonChar}${year} er).`);
		} else if(subjectCode == null && (seasonChar != null || year != null || componentType != null || componentCode != null)){ //unknown subject, and at least one other thing
			if(subjectErrorMessages.size == 1){
				throw new Error(`It looks like you're trying to open a paper (${"????"} ${seasonChar ?? "x"}${year ?? "??"} ${componentType ?? "xx"} ${componentCode ?? "??"}), but Pasapapor was unable to determine the subject due to the following error:\n${subjectErrorMessages.values().next().value}`);
			} else {
				console.log(subjectErrorMessages);
			}
			const bestErrorMessage = [...subjectErrorMessages.values()].sort((a, b) => b.length - a.length)[0];
			throw new Error(
				`It looks like you're trying to open a paper (${"????"} ${seasonChar ?? "x"}${year ?? "??"} ${componentType ?? "xx"} ${componentCode ?? "??"}). If you are, please specify the subject, like this example: (9231 s21 qp 43).`
				+ (bestErrorMessage ? ` The following error message may be helpful: ${bestErrorMessage}` : "")
			);
		} else if(syllabus){
			throw new Error("Pasapapor couldn't figure out what you're trying to open. If you're trying to open a syllabus, please specify the subject.");
		} else {
			throw new Error("Pasapapor couldn't figure out what you're trying to open. If you're trying to open a paper, enter the information in the form (subject) (season) (type) (code), like this: math s21 qp 43");
		}

	}


}

function getPaporFromInput(input:string, level:Level | null):Openable[] {

	console.log(`Parsing input: <<${input}>>`);
	let lowercaseInput = input.toLowerCase();
	const cleanedInput = lowercaseInput.replace(/[ \-_\/]/g, "");
	if(otherDocuments[cleanedInput]){
		console.log(`Input matched pattern: otherdocument`);
		return [otherDocuments[cleanedInput]];
	}
	const regularMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z ()0-9]+?)[ \-_\/]*([a-z]\d{1,4})[ \-_\/]*([a-z]{2})[ \-_\/]*?(\d\d)[ \-_\/]*$/);
	const typeOmittedMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z ()0-9]+?)[ \-_\/]*([a-z]\d{1,4})[ \-_\/]*(\d\d)[ \-_\/]*$/);
	const codelessMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z ()0-9]+?)[ \-_\/]*([a-z]\d{1,4})[ \-_\/]*(gt|er)[ \-_\/]*$/);
	const alternateMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z ()0-9]+?)[ \-_\/]*(\d\d)[ \-_\/]*(?:(f[ \-_\/]*m)|(m[ \-_\/]*j)|(o[ \-_\/]*n))[ \-_\/]*(\d\d)[ \-_\/]*([a-z]{2})?[ \-_\/]*$/);
	const syllabusMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z ()0-9]+?)[ \-_\/]+(?:s|syl|syll|syllab|syllabus)[ \-_\/]*(\d|\d\d|20\d\d|\d\d-\d\d|20\d\d-20\d\d)?$/);
	let subjectID:string, season:string, type:string | undefined, code:string | undefined;
	if(regularMatchData != null){
		console.log(`Input matched pattern: regular`);
		[, subjectID, season, type, code] = regularMatchData;
	} else if(typeOmittedMatchData != null){
		console.log(`Input matched pattern: typeOmitted`);
		[, subjectID, season, code] = typeOmittedMatchData;
	} else if(codelessMatchData != null){
		console.log(`Input matched pattern: codeless`);
		[, subjectID, season, type] = codelessMatchData;
	} else if(alternateMatchData != null){
		console.log(`Input matched pattern: alternate`);
		let m:string | undefined, s:string | undefined, w:string | undefined, year:string;
		[, subjectID, code, m, s, w, year, type] = alternateMatchData;
		if(m){
			season = `m${year}`;
		} else if(s){
			season = `s${year}`;
		} else if(w){
			season = `w${year}`;
		} else {
			never();
		}
	} else if(syllabusMatchData != null){
		console.log(`Input matched pattern: syllabus`);
		let [, subjectID, specifier] = syllabusMatchData;
		if(isNaN(parseInt(subjectID))) subjectID = getIDFromName(subjectID, level);
		return [{url: () => getSyllabusLink(subjectID, specifier), cleanString: () => `${subjectID} syllabus`}];
	} else {
		console.log(`Input did not match any known patterns, triggering smart parser...`);
		return smartParseInput(input, level);
	}

	season = validateSeason(season) ?? (() => {throw new Error(`Invalid season ${season}: must be of the format (season)(year) where season is f, m, s, j, w, o, or n, and year is a 1 or 2 digit year.`)})();
	if(isNaN(parseInt(subjectID))) subjectID = getIDFromName(subjectID, level);
	if(type && !isTypeValid(subjectID, type, code)) throw new Error(`Type ${type} is not a valid type for component ${subjectID}/${code}`);
	if(!type){
		if(!code) never();
		return [
			new Papor(subjectID, season, "ms", code),
			new Papor(subjectID, season, "qp", code)
		];
	} else {
		return [new Papor(subjectID, season, type, code)];
	}
}

function addListeners(){
	const firstLoad = localStorage.getItem("pasapapor-first-load") === null;
	localStorage.setItem("pasapapor-first-load", "false");

	//When a key is pressed
	pasapaporInput.addEventListener("keydown", (e) => {
		if(!(e instanceof KeyboardEvent)) never();
		if(e.key == "Enter"){
			//If it's enter, open papors
			try {
				errorbox.style.color = "var(--success-color)";
				errorbox.innerText = "";
				if(pasapaporInput.value.includes("amogus"))
					throw new Error("Too sus.");
				else if(/never.*gonna.*give.*you.*up/i.test(pasapaporInput.value))
					window.open(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
				else switch(pasapaporInput.value.toLowerCase()){
					case "as": case "a": case "asa": case "as a": case "as/a": case "as / a":
						buttonAsa.click(); pasapaporInput.value = ""; break;
					case "ig": case "i": case "igcse":
						buttonIgcse.click(); pasapaporInput.value = ""; break;
					default:
						const papors = getPaporFromInput(pasapaporInput.value, getSelectedLevel());
						if(papors.length == 1) window.open(papors[0].url(), "_blank");
						else {
							firstUsePopup("allow-popups", `You're trying to open multiple papers at once, but browsers will block this by default to prevent spam.\nInstructions to allow popups: Check the URL bar (left side or right side) for an icon or message that says "Popup blocked", then click it and select "Always allow popups and redirects from..."`, () => {
								papors.forEach(papor => window.open(papor.url(), "_blank"));
							}, true);
						}
						errorbox.innerText = `✔ Opened: ${papors.map(papor => papor.cleanString()).join(", ")}`;
						break;
				}
			} catch(err){
				errorbox.style.color = "var(--error-color)";
				errorbox.innerText = `❗ ${(err as Error).message}`;
			}
		}
	});

	window.addEventListener("keydown", e => {
		if(e.key == ";" && e.ctrlKey){
			pasapaporInput.value = "!$*&U!%# further maths wt5y5hwinter 2022questionpaper22";
		}
	});

	//When the selected level is changed
	buttonAsa.addEventListener("change", () => localStorage.setItem("pasapapor-level", Level.A_LEVELS));
	buttonIgcse.addEventListener("change", () => localStorage.setItem("pasapapor-level", Level.IGCSE));

	//Load saved level
	switch(localStorage.getItem("pasapapor-level")){
		case Level.A_LEVELS: buttonAsa.click(); break;
		case Level.IGCSE: buttonIgcse.click(); break;
	}

	let flashing = false;
	let bouncing = false;
	let flipped = false;
	let clickTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	headerText.addEventListener("click", e => {
		clickTimes.shift();
        clickTimes.push(Date.now());
		if(e.shiftKey) flashing = !flashing;
		if(e.altKey) bouncing = !bouncing;
		if(e.ctrlKey) flipped = !flipped;
		header.style.setProperty("transform", flipped ? "scaleX(-1)" : "none");
		headerText.style.setProperty("animation-name", bouncing ? "sizebounce" : "none");
		//modifying animation-play-state didn't work as the animation could get paused when the size is high, causing scrollbars to appear
		if(!e.shiftKey && !e.altKey && !e.ctrlKey)
			headerText.style.setProperty('color', `hsl(${Math.floor(Math.random() * 360)}, 80%, 80%)`);
		if(((Date.now() - clickTimes[0]) / 10) < 500)
			header.style.setProperty("visibility", "hidden");
	});
	setInterval(() => {
		if(flashing) headerText.style.setProperty('color', `hsl(${Math.floor(Math.random() * 360)}, 80%, 80%)`);
	}, 500);

	pasapaporInput.focus();
	pasapaporInput.select();

	Array.from(document.getElementsByClassName("hide-first-load")).forEach(el => {
		if(firstLoad)
			el.addEventListener("click", () => {
				el.classList.remove("hide-first-load");
			});
		else el.classList.remove("hide-first-load");
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
	if(window.innerWidth < 600){
		hoverInfo.innerText = "Tap for more info";
	}
	// infoHoverSpans.forEach(span => span.addEventListener("mouseleave", () => {
	// 	hoverInfo.style.color = "unset";
	// 	hoverInfo.innerText = `Hover for more information`;
	// }));
	window.addEventListener("beforeunload", () => {
		openedPapers.save();
	});

};

addListeners();
openedPapers.load();

