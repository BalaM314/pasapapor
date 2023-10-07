"use strict";
function isTypeValid(subjectID, type, code) {
    switch (type) {
        case "qp":
        case "ms": return true; //QP and MS exist for all subjects in almost all codes
        case "er":
        case "gt": return code == undefined; //ER is for every component
        case "ci": return !!( //confidential instructions, exists for all science practicals
        ["9700", "9701", "9702"].includes(subjectID) && (code === null || code === void 0 ? void 0 : code.match(/^3[1-6]$/)) ||
            ["9700", "9701", "9702"].includes(subjectID) && (code === null || code === void 0 ? void 0 : code.match(/^3[1-6]$/)) ||
            ["0610", "0970", "0620", "0971", "0625", "0972", "0652", "0973", "0654"].includes(subjectID) && (code === null || code === void 0 ? void 0 : code.match(/^5[1-3]$/)));
        case "sf": return !!( //source files, cs and ict
        ["9608", "9618"].includes(subjectID) && (code === null || code === void 0 ? void 0 : code.match(/^4[1-3]$/)) ||
            ["0417", "0983"].includes(subjectID) && (code === null || code === void 0 ? void 0 : code.match(/^[2-3][1-3]$/)));
        //case "in": return ["9706","9679","8679","9680","8680","9479","9609","9715","8681"].includes(subjectID); //Too many things have insert
        case "ir": return true;
        case "pm": return !!( //Prerelease material, only valid for some CS subjects
        ["9608"].includes(subjectID) && (code === null || code === void 0 ? void 0 : code.match(/^[24][1-3]$/)) ||
            ["0984", "0478"].includes(subjectID) && (code === null || code === void 0 ? void 0 : code.match(/^2[1-3]$/)));
        default: return true;
    }
}
function resolveSeasonChar(seasonString) {
    switch (seasonString) {
        case "spring":
        case "feb":
        case "march":
        case "mar":
        case "m":
        case "f":
            return "m";
        case "summer":
        case "may":
        case "june":
        case "jun":
        case "j":
        case "s":
            return "s";
        case "winter":
        case "october":
        case "november":
        case "oct":
        case "nov":
        case "w":
        case "o":
        case "n":
            return "w";
        default: return null;
    }
}
function smartParseInput(input, level) {
    //List of things that the input could mean:
    //Document such as mf19 or chem db
    //Syllabus
    //Pasapapor
    //Pasapapor with type omitted indicating QP and MS
    //Grade threshold or examiner report
    var _a, _b;
    //4 digit numbers could mean either a year or a subject code; use the first 2 digits of the number to decide.
    //2 digit numbers can mean either a year or a component code; parse [a-z]23 as a year, but 23 by itself is ambiguous. Possibly use positioning?
    //"s" without numbers directly after means syllabus
    //Some people might specify the season char and the year separately like "summer 2022"
    //Years like "22" cannot be accepted as it might also mean component 22
    //so if separate, year must be a 4 digit year
    input = input.toLowerCase();
    //Check for documents
    const cleanedInput = input.replace(/[ \-_\/]/g, "");
    if (cleanedInput in otherDocuments) {
        console.log(`Input matched otherdocument`);
        return [otherDocuments[cleanedInput]];
    }
    let syllabus = false, year = null, seasonChar = null, subjectCode = null, componentCode = null, componentType = null, syllabusRawYearSpecifier = null;
    //TODO: attempt to search for each component multiple times, with progressively decreasing strictness
    //Attempt to find season
    const x00Match = input.match(/(spring|feb|march|mar|f|m|summer|may|june|jun|s|j|winter|october|november|oct|nov|w|o|n)[^a-z0-9]*(20\d\d|\d\d|\d)(?!\d{2,3}(?:\D|$))/);
    //Negative lookbehind (?<![a-z]) could be used to not match strings such as phy(s20), but 
    //4 digit year: restricted to 20xx to match s2022 but not s9702 (should be parsed as "syllabus" "9702") (no subject codes start with 20)
    //Negative lookahead used to match s209701 but not s9702
    if (x00Match) {
        const [, _season, _year] = x00Match;
        const char = resolveSeasonChar(_season);
        if (char)
            seasonChar = char;
        else
            never();
        //Set the year
        if (_year.length == 1)
            year = "0" + _year; //9 -> 09
        else if (_year.length == 2)
            year = _year; //23 -> 23, no changes necessary
        else if (_year.length == 4)
            year = _year.slice(2); //2023 -> 23
        else
            never();
        input = removeMatch(input, x00Match, "@");
        console.log(`Found season and year: "${x00Match[0]}"`);
    }
    else {
        const xy00Match = input.match(/(f\/m|m\/j|o\/n)\/(\d\d)/);
        if (xy00Match) {
            const [, _season, _year] = xy00Match;
            if (_season == "f/m")
                seasonChar = "m";
            else if (_season == "m/j")
                seasonChar = "s";
            else if (_season == "o/n")
                seasonChar = "w";
            else
                never();
            year = _year;
            input = removeMatch(input, xy00Match, "@");
            console.log(`Found season and year: "${xy00Match[0]}" -> ${seasonChar}${year}`);
        }
        else
            console.log(`Unable to find season and year`);
    }
    //Search for syllabus
    const syllabusMatch = input.match(/(?<![a-z])(s|syl|syll|syllabus)(?![a-z])/); //\b does not work because it thinks _ is a word
    if (syllabusMatch) {
        syllabus = true;
        input = removeMatch(input, syllabusMatch, "@");
        //Look for well-demarcated syllabus raw year specifier (only accepts hyphens to separate years)
        const rawYearSpecifierMatch = input.match(/(?<=[ \-_\/]|^)(\d|20\d\d|\d\d-\d\d|20\d\d-20\d\d)(?=[ \-_\/]|$)/);
        if (rawYearSpecifierMatch)
            [, syllabusRawYearSpecifier] = rawYearSpecifierMatch;
        console.log(`Syllabus: specified: "${syllabusMatch[0]}"`);
    }
    else
        console.log(`Syllabus: not specified`);
    //Search for component code
    const componentCodeMatch = input.match(/(?<!\d)(\d{2})(?!\d)/);
    if (componentCodeMatch) {
        [, componentCode] = componentCodeMatch;
        input = removeMatch(input, componentCodeMatch, "@");
        console.log(`Found component code: "${componentCodeMatch[0]}"`);
    }
    else
        console.log(`Unable to find component code`);
    //Search for component type
    const componentTypeMatch = input.match(/(?<![a-z])(ci|er|gt|ms|qp|in|sf|ir|pm)(?![a-z])/);
    if (componentTypeMatch) {
        [, componentType] = componentTypeMatch;
        input = removeMatch(input, componentTypeMatch, "@");
        console.log(`Found component type: "${componentTypeMatch[0]}"`);
    }
    else {
        //Search for expanded component type
        const expandedComponentTypeMatch = input.match(/(confidential[ \-_\/]*?instructions?)|(examiner[ \-_\/]*?report)|(grade[ \-_\/]*?thresholds)|(marking[ \-_\/]*?scheme)|(question[ \-_\/]*?paper)|(insert)|(source[ \-_\/]*?files?)|(information[ \-_\/]*?report)|(pre[ \-_\/]*?release[ \-_\/]*?materials)/);
        if (expandedComponentTypeMatch) {
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
        }
        else
            console.log(`Unable to find component type`);
    }
    //Search for subject code
    const subjectCodeMatch = input.match(/([0789]\d\d\d)/);
    if (subjectCodeMatch) {
        [, subjectCode] = subjectCodeMatch;
        input = removeMatch(input, subjectCodeMatch, "@");
        console.log(`Found subject code: "${subjectCodeMatch[0]}"`);
    }
    else
        console.log(`Unable to find subject code`);
    //If season is unknown, try again with looser search, and after sections of the input have been removed
    if (seasonChar == null || year == null) {
        const yearMatch = input.match(/20(\d\d)/);
        if (yearMatch) {
            year = yearMatch[1];
            input = removeMatch(input, yearMatch, "@");
            console.log(`Found year with looser search: "${yearMatch[0]}"`);
        }
        else
            console.log(`Unable to find year with looser search`);
        //Either any of the words, or any of the characters that do not have letters immediately before or after (that means we matched a random letter in a longer word)
        const seasonMatch = input.match(/(spring|feb|march|mar|summer|may|june|jun|winter|october|november|oct|nov)|((?<![a-z])[fmsjwon](?![a-z]))/);
        if (seasonMatch) {
            const char = resolveSeasonChar(seasonMatch[0]);
            if (char == null)
                never();
            seasonChar = char;
            input = removeMatch(input, seasonMatch, "@");
            console.log(`Found season with looser search: "${seasonMatch[0]}"`);
        }
        else
            console.log(`Unable to find season with looser search`);
    }
    let remainingStrings;
    let subjectErrorMessages = new Set; //very cursed but it works
    if (subjectCode == null) {
        console.log(`Parsing remaining input to find subject code <<${input}>>`);
        remainingStrings = (_a = input.match(/[a-z ]*[a-z][a-z ]*/g)) !== null && _a !== void 0 ? _a : []; //this regex is probably O(n^2) or worse
        //TODO handle stuff like further___math
        //TODO duped code here
        for (const str of remainingStrings) {
            if (str.trim() == "" || ["the", "to", "and", "for", "he", "his", "me", "no", "them", "first", "us", "paper"].includes(str.trim()))
                continue;
            try {
                console.log(`Checking <<${str.trim()}>>`);
                subjectCode = getIDFromName(str.trim(), level);
                console.log(`Found subject code ${subjectCode}`);
                break;
            }
            catch (err) {
                subjectErrorMessages.add(err.message);
            }
        }
        console.log(`Parsing remaining input again but with different splitting logic`);
        if (subjectCode == null) {
            //Try a different match
            remainingStrings = (_b = input.match(/[a-z]+/g)) !== null && _b !== void 0 ? _b : [];
            for (const str of remainingStrings) {
                if (str.trim() == "" || ["the", "to", "and", "for", "he", "his", "me", "no", "them", "first", "us", "paper"].includes(str.trim()))
                    continue;
                try {
                    console.log(`Checking <<${str.trim()}>>`);
                    subjectCode = getIDFromName(str.trim(), level);
                    console.log(`Found subject code ${subjectCode}`);
                    break;
                }
                catch (err) {
                    subjectErrorMessages.add(err.message);
                }
            }
        }
    }
    console.log(`Parsed information: `, {
        syllabus, year, seasonChar, subjectID: subjectCode, componentCode, componentType,
        remainingInput: input, remainingStrings
    });
    console.log(`Attempting to find a type to open`);
    if (subjectCode != null && seasonChar != null && year != null && componentType != null && componentCode != null) {
        if (componentType && !isTypeValid(subjectCode, componentType, componentCode))
            throw new Error(`Type ${componentType} is not a valid type for component ${subjectCode}/${componentCode}`);
        console.log(`Chunks matched pattern: regular`);
        return [new Papor(subjectCode, `${seasonChar}${year}`, componentType, componentCode)];
    }
    else if (subjectCode != null && seasonChar != null && year != null && componentType == null && componentCode != null) {
        console.log(`Chunks matched pattern: typeOmitted`);
        return [
            new Papor(subjectCode, `${seasonChar}${year}`, "qp", componentCode),
            new Papor(subjectCode, `${seasonChar}${year}`, "ms", componentCode),
        ];
    }
    else if (subjectCode != null && seasonChar != null && year != null && (componentType == "er" || componentType == "gt") && componentCode == null) {
        console.log(`Chunks matched pattern: codeOmitted`);
        return [new Papor(subjectCode, `${seasonChar}${year}`, componentType)];
    }
    else if (syllabus == true && subjectCode != null) {
        if (syllabusRawYearSpecifier == null) {
            //Try to get it by parsing the remaining input
            const rawYearSpecifierMatch = input.match(/20\d\d-20\d\d|\d\d-\d\d|20\d\d|\d\d|\d/);
            if (rawYearSpecifierMatch)
                [, syllabusRawYearSpecifier] = rawYearSpecifierMatch;
        }
        const link = getSyllabusLink(subjectCode, syllabusRawYearSpecifier);
        console.log(`Chunks matched pattern: syllabus`);
        return [{ url: () => link, cleanString: () => `${subjectCode} syllabus` }];
    }
    else {
        //Try to guess what the user was trying to do
        //Syllabus requires a very minimal amount of info (subject and a phrase implying syllabus, such as "s" or "syl"), so do that last
        console.log(`Chunks did not match any pattern, erroring`);
        if (subjectCode != null && componentType != null && componentCode != null) { //missing season
            throw new Error(`It looks like you're trying to open a paper (${subjectCode} ${componentType} ${componentCode}). If you are, please specify the year and season, like this: (${subjectCode} s22 ${componentType} ${componentCode})`);
        }
        else if (subjectCode != null && seasonChar != null && year != null && componentType != null) { //missing component code
            throw new Error(`It looks like you're trying to open a paper (${subjectCode} ${seasonChar}${year} ${componentType}). If you are, please specify the component code, like this: (${subjectCode} ${seasonChar}${year} ${componentType} 12). You can only omit the component code if you're trying to open something that doesnt have a code, such as the grade thresholds (${subjectCode} ${seasonChar}${year} gt) or the examiner report (${subjectCode} ${seasonChar}${year} er).`);
        }
        else if (subjectCode == null && (seasonChar != null || year != null || componentType != null || componentCode != null)) { //unknown subject, and at least one other thing
            if (subjectErrorMessages.size == 1) {
                throw new Error(`It looks like you're trying to open a paper (${"????"} ${seasonChar !== null && seasonChar !== void 0 ? seasonChar : "x"}${year !== null && year !== void 0 ? year : "??"} ${componentType !== null && componentType !== void 0 ? componentType : "xx"} ${componentCode !== null && componentCode !== void 0 ? componentCode : "??"}), but Pasapapor was unable to determine the subject due to the following error:\n${subjectErrorMessages.values().next().value}`);
            }
            else {
                console.log(subjectErrorMessages);
            }
            const bestErrorMessage = [...subjectErrorMessages.values()].sort((a, b) => b.length - a.length)[0];
            throw new Error(`It looks like you're trying to open a paper (${"????"} ${seasonChar !== null && seasonChar !== void 0 ? seasonChar : "x"}${year !== null && year !== void 0 ? year : "??"} ${componentType !== null && componentType !== void 0 ? componentType : "xx"} ${componentCode !== null && componentCode !== void 0 ? componentCode : "??"}). If you are, please specify the subject, like this example: (9231 s21 qp 43).`
                + (bestErrorMessage ? ` The following error message may be helpful: ${bestErrorMessage}` : ""));
        }
        else if (syllabus) {
            throw new Error("Pasapapor couldn't figure out what you're trying to open. If you're trying to open a syllabus, please specify the subject.");
        }
        else {
            throw new Error("Pasapapor couldn't figure out what you're trying to open. If you're trying to open a paper, enter the information in the form (subject) (season) (type) (code), like this: math s21 qp 43");
        }
    }
}
function getPaporFromInput(input, level) {
    var _a;
    console.log(`Parsing input: <<${input}>>`);
    let lowercaseInput = input.toLowerCase();
    const cleanedInput = lowercaseInput.replace(/[ \-_\/]/g, "");
    if (otherDocuments[cleanedInput]) {
        console.log(`Input matched pattern: otherdocument`);
        return [otherDocuments[cleanedInput]];
    }
    const regularMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z][a-z ()0-9]*?)[ \-_\/]*([a-z]\d{1,4})[ \-_\/]*([a-z]{2})[ \-_\/]*?(\d\d)[ \-_\/]*$/);
    const typeOmittedMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z][a-z ()0-9]*?)[ \-_\/]*([a-z]\d{1,4})[ \-_\/]*(\d\d)[ \-_\/]*$/);
    const codelessMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z][a-z ()0-9]*?)[ \-_\/]*([a-z]\d{1,4})[ \-_\/]*(gt|er)[ \-_\/]*$/);
    const alternateMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z][a-z ()0-9]*?)[ \-_\/]*(\d\d)[ \-_\/]*(?:(f[ \-_\/]*m)|(m[ \-_\/]*j)|(o[ \-_\/]*n))[ \-_\/]*(\d\d)[ \-_\/]*([a-z]{2})?[ \-_\/]*$/);
    const syllabusMatchData = lowercaseInput.match(/^[ \-_\/]*(\d{4}|[a-z][a-z ()0-9]*?)[ \-_\/]+(?:s|syl|syll|syllab|syllabus)[ \-_\/]*(\d|\d\d|20\d\d|\d\d-\d\d|20\d\d-20\d\d)?$/);
    let subjectID, season, type, code;
    if (regularMatchData != null) {
        console.log(`Input matched pattern: regular`);
        [, subjectID, season, type, code] = regularMatchData;
    }
    else if (typeOmittedMatchData != null) {
        console.log(`Input matched pattern: typeOmitted`);
        [, subjectID, season, code] = typeOmittedMatchData;
    }
    else if (codelessMatchData != null) {
        console.log(`Input matched pattern: codeless`);
        [, subjectID, season, type] = codelessMatchData;
    }
    else if (alternateMatchData != null) {
        console.log(`Input matched pattern: alternate`);
        let m, s, w, year;
        [, subjectID, code, m, s, w, year, type] = alternateMatchData;
        if (m) {
            season = `m${year}`;
        }
        else if (s) {
            season = `s${year}`;
        }
        else if (w) {
            season = `w${year}`;
        }
        else {
            never();
        }
    }
    else if (syllabusMatchData != null) {
        console.log(`Input matched pattern: syllabus`);
        let [, subjectID, specifier] = syllabusMatchData;
        if (isNaN(parseInt(subjectID)))
            subjectID = getIDFromName(subjectID, level);
        return [{ url: () => getSyllabusLink(subjectID, specifier), cleanString: () => `${subjectID} syllabus` }];
    }
    else {
        console.log(`Input did not match any known patterns, triggering smart parser...`);
        return smartParseInput(input, level);
    }
    season = (_a = validateSeason(season)) !== null && _a !== void 0 ? _a : (() => { throw new Error(`Invalid season ${season}: must be of the format (season)(year) where season is f, m, s, j, w, o, or n, and year is a 1 or 2 digit year.`); })();
    if (isNaN(parseInt(subjectID)))
        subjectID = getIDFromName(subjectID, level);
    if (type && !isTypeValid(subjectID, type, code))
        throw new Error(`Type ${type} is not a valid type for component ${subjectID}/${code}`);
    if (!type) {
        if (!code)
            never();
        return [
            new Papor(subjectID, season, "ms", code),
            new Papor(subjectID, season, "qp", code)
        ];
    }
    else {
        return [new Papor(subjectID, season, type, code)];
    }
}
/** Represents a pasapapor. */
class Papor {
    constructor(subjectID, season, type, code) {
        var _a;
        this.subjectID = subjectID;
        this.season = season;
        this.type = type;
        this.code = code;
        this.year = `20${season.slice(1)}`;
        const data = (_a = subjectMapping[subjectID]) !== null && _a !== void 0 ? _a : (() => { throw new Error(`Invalid subject id "${subjectID}"`); })();
        this.name = data.name;
        this.level = data.level;
    }
    url() {
        const filetype = this.type == "sf" ? "zip" : "pdf";
        return this.code ?
            `https://papers.gceguide.com/${this.level}/${this.name}/${this.year}/${this.subjectID}_${this.season}_${this.type}_${this.code}.${filetype}` :
            `https://papers.gceguide.com/${this.level}/${this.name}/${this.year}/${this.subjectID}_${this.season}_${this.type}.${filetype}`;
    }
    toString() {
        return `Papor{ ${this.subjectID}_${this.season}_${this.type}_${this.code} }`;
    }
    cleanString() {
        if (this.code) {
            return `${this.subjectID}_${this.season}_${this.type}_${this.code}`;
        }
        else {
            return `${this.subjectID}_${this.season}_${this.type}`;
        }
    }
    shortString() {
        if (this.code) {
            return `${this.subjectID}_${this.season}_${this.code}`;
        }
        else
            return null;
    }
}
function getSyllabusLink(code, specifier) {
    if (!(code in syllabusData))
        throw new Error(`Syllabus unknown for subject id ${code}`);
    const fragments = syllabusData[code];
    let fragment;
    if (!specifier)
        fragment = fragments[0];
    else if (specifier.length == 1)
        fragment = fragments[+specifier - 1];
    else if (specifier.length == 2)
        fragment = fragments.find(f => f.includes(`-20${specifier}`));
    else if (specifier.length == 4)
        fragment = fragments.find(f => f.includes(`-${specifier}`));
    else if (specifier.length == 5)
        fragment = fragments.find(f => f.includes(`-20${specifier.split("-")[0]}-20${specifier.split("-")[1]}`));
    else if (specifier.length == 9)
        fragment = fragments.find(f => f.includes(`-${specifier}`));
    fragment !== null && fragment !== void 0 ? fragment : (fragment = fragments[0]);
    return fragment.startsWith("https://") ? fragment : `https://www.cambridgeinternational.org/Images/${fragment}-syllabus.pdf`;
    //necessary because cambridge typo'd the syllabus for german
}
/** Guesses a subject based on input. */
function guessData(name, level) {
    return Object.entries(subjectMapping)
        .filter(([id, data]) => (level == null || data.level == level) &&
        data.name.toLowerCase().replaceAll(/[()\-&]/g, "").replaceAll(/ +/g, " ").includes(name.toLowerCase()));
}
/** Validates a season, correcting it if it is "f22" or "w9". */
function validateSeason(season) {
    const matchData = season.match(/^([a-z])(\d{1}|\d{2}|\d{4})$/i);
    if (matchData == null)
        return null;
    let [, seasonChar, year] = matchData;
    let processedSeason;
    let processedYear;
    if (year.length == 1) {
        processedYear = "0" + year;
    }
    else if (year.length == 4) {
        processedYear = year.slice(2);
    }
    else {
        processedYear = year;
    }
    switch (seasonChar) {
        case "m":
        case "f":
            processedSeason = "m";
            break;
        case "j":
        case "s":
            processedSeason = "s";
            break;
        case "w":
        case "o":
        case "n":
            processedSeason = "w";
            break;
        default:
            return null;
    }
    return processedSeason + processedYear;
}
/** Gets the subject id from entered string name. Throws if too many or no results. */
function getIDFromName(name, level) {
    if (level == null) {
        const aLevelGuess = shorthandSubjectNames[Level.A_LEVELS][name.toLowerCase()];
        const igcseGuess = shorthandSubjectNames[Level.IGCSE][name.toLowerCase()];
        if (aLevelGuess && igcseGuess)
            throw new Error(`Subject "${name}" could refer to either IGCSE or A Levels. Please specify using the radio buttons.`);
        if (aLevelGuess)
            return aLevelGuess;
        if (igcseGuess)
            return igcseGuess;
    }
    else {
        if (shorthandSubjectNames[level][name.toLowerCase()])
            return shorthandSubjectNames[level][name.toLowerCase()];
    }
    const guesses = guessData(name, level);
    if (guesses.length == 1)
        return guesses[0][0];
    if (guesses.length == 0)
        throw new Error(`Unknown subject "${name}".`);
    if (guesses.length <= 5)
        throw new Error(`Ambiguous subject "${name}". Did you mean ${guesses.map(guess => `"${guess[1].name}"`).join(" or ")}?${level == null ? " Specifying the level with the radio buttons may help." : ""}`);
    throw new Error(`Ambiguous subject "${name}".`);
}
