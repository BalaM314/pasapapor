"use strict";
const papersSource = "https://papers.gceguide.com";
var Level;
(function (Level) {
    Level["IGCSE"] = "Cambridge IGCSE";
    Level["A_LEVELS"] = "A Levels";
})(Level || (Level = {}));
function getSubjectData() {
    //JSON.stringify(Object.fromEntries(Array.from(temp0.children).map(el => [el.innerText.match(/\((\d+)\)/)?.[1], el.innerText]).filter(([id, text]) => id != undefined)));
    //Get this with an XMLHTTPRequest
    return [["9706", "Accounting (9706)"], ["9679", "Afrikaans (9679)"], ["8779", "Afrikaans - First Language (AS Level only) (8779)"], ["8679", "Afrikaans - Language (AS Level only) (8679)"], ["9713", "Applied Information and Communication Technology (9713)"], ["9680", "Arabic (9680)"], ["8680", "Arabic - Language (AS Level only) (8680)"], ["9479", "Art & Design (9479)"], ["9704", "Art & Design (9704)"], ["9700", "Biology (9700)"], ["9609", "Business (9609)"], ["9707", "Business Studies (9707)"], ["9980", "Cambridge International Project Qualification (9980)"], ["9701", "Chemistry (9701)"], ["9715", "Chinese (A Level only) (9715)"], ["8681", "Chinese - Language (AS Level only) (8681)"], ["9274", "Classical Studies (9274)"], ["9608", "Computer Science (for final examination in 2021) (9608)"], ["9618", "Computer Science (for first examination in 2021) (9618)"], ["9691", "Computing (9691)"], ["9631", "Design & Textiles (9631)"], ["9705", "Design and Technology (9705)"], ["9481", "Digital Media & Design (9481)"], ["9011", "Divinity (9011)"], ["8041", "Divinity (AS Level only) (8041)"], ["9482", "Drama (9482)"], ["9708", "Economics (9708)"], ["9093", "English - Language AS and A Level (9093)"], ["9093", "English - Language AS and A Level (9093)"], ["8695", "English - Language and Literature (AS Level only) (8695)"], ["9695", "English - Literature (9695)"], ["8021", "English General Paper (AS Level only) (8021)"], ["8291", "Environmental Management (AS only) (8291)"], ["9336", "Food Studies (9336)"], ["9716", "French (A Level only) (9716)"], ["8682", "French - Language (AS Level only) (8682)"], ["8670", "French - Literature (AS Level only) (8670)"], ["8001", "General Paper 8001 (AS Level only) (8001)"], ["8004", "General Paper 8004 (AS Level only) (8004)"], ["9696", "Geography (9696)"], ["9717", "German (A Level only) (9717)"], ["8683", "German - Language (AS Level only) (8683)"], ["9239", "Global Perspectives & Research (9239)"], ["9687", "Hindi (A Level only) (9687)"], ["8687", "Hindi - Language (AS Level only) (8687)"], ["8675", "Hindi - Literature (AS Level only) (8675)"], ["9014", "Hinduism (9014)"], ["9487", "Hinduism (9487)"], ["8058", "Hinduism (AS level only) (8058)"], ["9489", "History (9489)"], ["9389", "History (for final examination in 2021) (9389)"], ["9626", "Information Technology (9626)"], ["9488", "Islamic Studies (9488)"], ["8281", "Japanese Language (AS Level only) (8281)"], ["9084", "Law (9084)"], ["9693", "Marine Science (9693)"], ["9709", "Mathematics (9709)"], ["9231", "Mathematics - Further (9231)"], ["9607", "Media Studies (9607)"], ["9483", "Music (9483)"], ["9703", "Music (9703)"], ["8663", "Music (AS Level only) (8663)"], ["8024", "Nepal Studies (AS Level only) (8024)"], ["9396", "Physical Education (9396)"], ["9702", "Physics (9702)"], ["9718", "Portuguese (A Level only) (9718)"], ["8684", "Portuguese - Language (AS Level only) (8684)"], ["8672", "Portuguese - Literature (AS Level only) (8672)"], ["9698", "Psychology (9698)"], ["9990", "Psychology (9990)"], ["9699", "Sociology (9699)"], ["9719", "Spanish (A Level only) (9719)"], ["8665", "Spanish - First Language (AS Level only) (8665)"], ["8685", "Spanish - Language (AS Level only) (8685)"], ["8673", "Spanish - Literature (AS Level only) (8673)"], ["9689", "Tamil (9689)"], ["8689", "Tamil - Language (AS Level only) (8689)"], ["9694", "Thinking Skills (9694)"], ["9395", "Travel & Tourism (9395)"], ["9676", "Urdu (A Level only) (9676)"], ["8686", "Urdu - Language (AS Level only) (8686)"], ["9686", "Urdu - Pakistan only (A Level only) (9686)"]];
}
function getSubjectMapping() {
    return Object.fromEntries(getSubjectData()
        .map(([id, name]) => ([id, {
            level: Level.A_LEVELS,
            name
        }])));
}
/**
 * Gets a url given all data
 * @param subjectName The string name of the subject, example: Mathematics - Further (9231)
 * @param subjectID The numerical id of the subject, example: 9231
 * @param year The full year of the paper, example: 2021
 * @param season The season of the paper with year, example: w21
 * @param type The type of paper, example: qp, ms
 * @param code The paper code, example: 43
 * @returns The url to the paper
 */
const urlForData = (level, subjectName, subjectID, year, season, type, code) => `https://papers.gceguide.com/${level}/${subjectName}/${year}/${subjectID}_${season}_${type}_${code}.pdf`;
/**
 * Gets the url of the paper given all required information
 */
function getPaperUrlFromData(subjectMapping, subjectID, season, type, code) {
    const data = subjectMapping[subjectID];
    if (!data)
        throw new Error(`Unknown subject id "${subjectID}"`);
    return urlForData(data.level, data.name, subjectID, `20${season.slice(1)}`, season, type, code);
}
function getPaperUrlFromInput(input) {
    const subjectMapping = getSubjectMapping();
    const matchData = input.match(/(\d\d\d\d)[^\d\n]*?([wsmj](?:20)?\d\d)[^\d\n]*?([a-zA-Z]{2})[^\d\n]*?(\d\d)/);
    if (matchData == null || matchData.length != 5)
        throw new Error("Please enter the paper info like this: 9231 w21 qp 31");
    let [, subjectID, season, type, code] = matchData;
    return [encodeURI(getPaperUrlFromData(subjectMapping, subjectID, season, type, code))];
}
