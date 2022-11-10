
const pasapaporInput = <HTMLInputElement>document.querySelector("#pasapapor-select");
const levelSelectDiv = <HTMLDivElement>document.querySelector("#level-select");
const errorbox = <HTMLDivElement>document.querySelector("#errorbox");
enum Level {
	IGCSE = "Cambridge IGCSE",
	A_LEVELS = "A Levels"
}
const subjectMapping = getSubjectMapping();
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
		"8021": ["ge"],
		"9618": ["cs", "compsci"],
		"9231": ["further math", "f math", "math f", "math further", "meth"],
		"9990": ["psy", "psych", "psycho", "psychology"],
	},
});
class Papor {
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
}

function getSubjectData():[igcse:[id:string, name:string][], alevels:[id:string, name:string][]] {
	//JSON.stringify(Object.fromEntries(Array.from(temp0.children).map(el => [el.innerText.match(/\((\d+)\)/)?.[1], el.innerText]).filter(([id, text]) => id != undefined)));
	//Get this with an XMLHTTPRequest
	return [
		[["0452","Accounting (0452)"],["0985","Accounting (9-1) (0985)"],["0548","Afrikaans - Second Language (0548)"],["0600","Agriculture (0600)"],["0508","Arabic - First Language (0508)"],["7184","Arabic - First Language (9-1) (7184)"],["0544","Arabic - Foreign Language (0544)"],["0400","Art & Design (0400)"],["0989","Art & Design (9-1) (0989)"],["0538","Bahasa Indonesia (0538)"],["0610","Biology (0610)"],["0970","Biology (9-1) (0970)"],["0450","Business Studies (0450)"],["0986","Business Studies (9-1) (0986)"],["0620","Chemistry (0620)"],["0971","Chemistry (9-1) (0971)"],["0547","Chinese (Mandarin) - Foreign Language (0547)"],["0509","Chinese - First Language (0509)"],["0523","Chinese - Second Language (0523)"],["0478","Computer Science (0478)"],["0984","Computer Science (9-1) (0984)"],["0420","Computer Studies (0420)"],["0445","Design & Technology (0445)"],["0979","Design & Technology (9-1) (0979)"],["0453","Development Studies (0453)"],["0411","Drama (0411)"],["0994","Drama (9-1) (0994)"],["0515","Dutch - Foreign Language (0515)"],["0455","Economics (0455)"],["0987","Economics (9-1) (0987)"],["0500","English - First Language (0500)"],["0990","English - First Language (9-1) (0990)"],["0627","English - First Language (9-1) (UK only) (0627)"],["0522","English - First Language (UK) (0522)"],["0524","English - First Language (US) (0524)"],["0486","English - Literature (0486)"],["0477","English - Literature (9-1) (UK only) (0477)"],["0427","English - Literature (US) (0427)"],["0475","English - Literature in English (0475)"],["0992","English - Literature in English (9-1) (0992)"],["0991","English - Second Language (9-1) (0991)"],["0511","English as a Second Language (Count-in speaking) (0511)"],["0510","English as a Second Language (Speaking endorsement) (0510)"],["0993","English as a Second Language (Speaking endorsement) (9-1) (0993)"],["0454","Enterprise (0454)"],["0680","Environmental Management (0680)"],["0648","Food & Nutrition (0648)"],["7156","French (9-1) (7156)"],["0501","French - First Language (0501)"],["0520","French - Foreign Language (0520)"],["0460","Geography (0460)"],["0976","Geography (9-1) (0976)"],["7159","German (9-1) (7159)"],["0505","German - First Language (0505)"],["0525","German - Foreign Language (0525)"],["0457","Global Perspectives (0457)"],["0549","Hindi as a Second Language (0549)"],["0470","History (0470)"],["0977","History (9-1) (0977)"],["0409","History - American (US) (0409)"],["0447","India Studies (0447)"],["0417","Information and Communication Technology (0417)"],["0983","Information and Communication Technology (9-1) (0983)"],["0531","IsiZulu as a Second Language (0531)"],["0493","Islamiyat (0493)"],["7164","Italian (9-1) (7164)"],["0535","Italian - Foreign Language (0535)"],["0480","Latin (0480)"],["0696","Malay - First Language (0696)"],["0546","Malay - Foreign Language (0546)"],["0697","Marine Science (0697)"],["0697","Marine Science (Maldives only) (0697)"],["0580","Mathematics (0580)"],["0980","Mathematics (9-1) (0980)"],["0444","Mathematics (US) (0444)"],["0606","Mathematics - Additional (0606)"],["0607","Mathematics - International (0607)"],["0410","Music (0410)"],["0978","Music (9-1) (0978)"],["0448","Pakistan Studies (0448)"],["0413","Physical Education (0413)"],["0995","Physical Education (9-1) (0995)"],["0652","Physical Science (0652)"],["0625","Physics (0625)"],["0972","Physics (9-1) (0972)"],["0504","Portuguese - First Language (0504)"],["0490","Religious Studies (0490)"],["0499","Sanskrit (0499)"],["0653","Science - Combined (0653)"],["0973","Sciences - Co-ordinated (9-1) (0973)"],["0654","Sciences - Co-ordinated (Double) (0654)"],["0495","Sociology (0495)"],["7160","Spanish (9-1) (7160)"],["0502","Spanish - First Language (0502)"],["0530","Spanish - Foreign Language (0530)"],["0488","Spanish - Literature (0488)"],["0262","Swahili (0262)"],["0518","Thai - First Language (0518)"],["0471","Travel & Tourism (0471)"],["0513","Turkish - First Language (0513)"],["0539","Urdu as a Second Language (0539)"],["0408","World Literature (0408)"]],
		[["9706","Accounting (9706)"],["9679","Afrikaans (9679)"],["8779","Afrikaans - First Language (AS Level only) (8779)"],["8679","Afrikaans - Language (AS Level only) (8679)"],["9713","Applied Information and Communication Technology (9713)"],["9680","Arabic (9680)"],["8680","Arabic - Language (AS Level only) (8680)"],["9479","Art & Design (9479)"],["9704","Art & Design (9704)"],["9700","Biology (9700)"],["9609","Business (9609)"],["9707","Business Studies (9707)"],["9980","Cambridge International Project Qualification (9980)"],["9701","Chemistry (9701)"],["9715","Chinese (A Level only) (9715)"],["8681","Chinese - Language (AS Level only) (8681)"],["9274","Classical Studies (9274)"],["9608","Computer Science (for final examination in 2021) (9608)"],["9618","Computer Science (for first examination in 2021) (9618)"],["9691","Computing (9691)"],["9631","Design & Textiles (9631)"],["9705","Design and Technology (9705)"],["9481","Digital Media & Design (9481)"],["9011","Divinity (9011)"],["8041","Divinity (AS Level only) (8041)"],["9482","Drama (9482)"],["9708","Economics (9708)"],["9093","English - Language AS and A Level (9093)"],["9093","English - Language AS and A Level (9093)"],["8695","English - Language and Literature (AS Level only) (8695)"],["9695","English - Literature (9695)"],["8021","English General Paper (AS Level only) (8021)"],["8291","Environmental Management (AS only) (8291)"],["9336","Food Studies (9336)"],["9716","French (A Level only) (9716)"],["8682","French - Language (AS Level only) (8682)"],["8670","French - Literature (AS Level only) (8670)"],["8001","General Paper 8001 (AS Level only) (8001)"],["8004","General Paper 8004 (AS Level only) (8004)"],["9696","Geography (9696)"],["9717","German (A Level only) (9717)"],["8683","German - Language (AS Level only) (8683)"],["9239","Global Perspectives & Research (9239)"],["9687","Hindi (A Level only) (9687)"],["8687","Hindi - Language (AS Level only) (8687)"],["8675","Hindi - Literature (AS Level only) (8675)"],["9014","Hinduism (9014)"],["9487","Hinduism (9487)"],["8058","Hinduism (AS level only) (8058)"],["9489","History (9489)"],["9389","History (for final examination in 2021) (9389)"],["9626","Information Technology (9626)"],["9488","Islamic Studies (9488)"],["8281","Japanese Language (AS Level only) (8281)"],["9084","Law (9084)"],["9693","Marine Science (9693)"],["9709","Mathematics (9709)"],["9231","Mathematics - Further (9231)"],["9607","Media Studies (9607)"],["9483","Music (9483)"],["9703","Music (9703)"],["8663","Music (AS Level only) (8663)"],["8024","Nepal Studies (AS Level only) (8024)"],["9396","Physical Education (9396)"],["9702","Physics (9702)"],["9718","Portuguese (A Level only) (9718)"],["8684","Portuguese - Language (AS Level only) (8684)"],["8672","Portuguese - Literature (AS Level only) (8672)"],["9698","Psychology (9698)"],["9990","Psychology (9990)"],["9699","Sociology (9699)"],["9719","Spanish (A Level only) (9719)"],["8665","Spanish - First Language (AS Level only) (8665)"],["8685","Spanish - Language (AS Level only) (8685)"],["8673","Spanish - Literature (AS Level only) (8673)"],["9689","Tamil (9689)"],["8689","Tamil - Language (AS Level only) (8689)"],["9694","Thinking Skills (9694)"],["9395","Travel & Tourism (9395)"],["9676","Urdu (A Level only) (9676)"],["8686","Urdu - Language (AS Level only) (8686)"],["9686","Urdu - Pakistan only (A Level only) (9686)"]]
	];
}

function getSubjectMapping():SubjectMapping {
	const subjectData = getSubjectData();
	return Object.fromEntries([
		...subjectData[0]
		.map(([id, name]) => ([id, {
			level: Level.IGCSE,
			name
		}])),
		...subjectData[1]
		.map(([id, name]) => ([id, {
			level: Level.A_LEVELS,
			name
		}])),
	]);
}

function guessData(name:string, level:Level | null):[string, SubjectData][] {
	return Object.entries(subjectMapping)
		.filter(
			([id, data]) =>
				(level == null || data.level == level) &&
				data.name.toLowerCase().replaceAll(/[()\-&]/g, "").replaceAll(/ +/g, " ").includes(name.toLowerCase())
		);
}

function validateSeason(season:string):string | null {
	const matchData = season.match(/(\w)(\d{1,2})/);
	if(matchData == null) return null;
	let [seasonChar, year] = matchData;
	let processedSeason:string;
	let processedYear:string;
	if(parseInt(year) <= 9){
		processedYear = "0" + year.slice(-1);
	} else {
		processedYear = year;
	}
	switch(seasonChar){
		case "f": case "m":
			processedSeason = "m"; break;
		case "j":
			processedSeason = "j"; break;
		case "s":
			processedSeason = "s"; break;
		case "w": case "o": case "n":
			processedSeason = "w"; break;
		default:
			return null;
	}
	return processedSeason + processedYear;
}

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

function never():never {throw new Error("code failed");}

function getPaporFromInput(input:string, level:Level | null):Papor[] {
	const regularMatchData = input.match(/^[ \-_]*(\d\d\d\d|[a-zA-Z ()0-9]+?)[ \-_]*([wsmj](?:20[012]\d|[012]?\d))[ \-_]*(ci|er|ms|qp|in|sf|ir)[ \-_]*?(\d\d)[ \-_]*$/);
	const typeOmittedMatchData = input.match(/^[ \-_]*(\d\d\d\d|[a-zA-Z ()0-9]+?)[ \-_]*([wsmj](?:20[012]\d|[012]?\d))[ \-_]*(\d\d)[ \-_]*$/);
	const codelessMatchData = input.match(/^[ \-_]*(\d\d\d\d|[a-zA-Z ()0-9]+?)[ \-_]*([wsmj](?:20[012]\d|[012]?\d))[ \-_]*(gt|er)[ \-_]*$/);
	let subjectID:string, season:string, type:string | undefined, code:string | undefined;
	if(regularMatchData != null){
		[, subjectID, season, type, code] = regularMatchData;
	} else if(typeOmittedMatchData != null){
		[, subjectID, season, code] = typeOmittedMatchData;
	} else if(codelessMatchData != null){
		[, subjectID, season, type] = codelessMatchData;
	} else {
		throw new Error("Improperly formatted input.");
	}
	if(parseInt(season.slice(1)) <= 9 && code){
		if(code.startsWith("0")) code = code.charAt(1);
		else code = code.charAt(0);
	}
	if(isNaN(parseInt(subjectID))) subjectID = getIDFromName(subjectID, level);
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

window.onload = () => {
	pasapaporInput.addEventListener("keydown", (e) => {
		if(!(e instanceof KeyboardEvent)) never();
		if(e.key == "Enter"){
			try {
				if(pasapaporInput.value.includes("amogus")) throw new Error("Too sus.");
				const urls = getPaporFromInput(pasapaporInput.value, getSelectedLevel()).map(papor => papor.url());
				if(urls.length == 1) window.open(urls[0]);
				else urls.forEach(url => window.open(url, "_blank"));
				errorbox.innerText = "";
			} catch(err){
				errorbox.innerText = `Error: ${(err as Error).message}`;
			}
		}
	});

	pasapaporInput.focus();
	pasapaporInput.select();
};

