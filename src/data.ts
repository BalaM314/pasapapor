import { impossible } from "./funcs.js";
import type { Openable, SubjectData } from "./types.js";

const now = new Date();
export const isAprilFools = (now.getDate() == 1 && now.getMonth() == 4);

export const otherDocuments: {
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

export enum Level {
	IGCSE = "Cambridge IGCSE",
	A_LEVELS = "A Levels"
}

export const subjectIDs = {
	[Level.IGCSE]: ["0262","0400","0408","0409","0410","0411","0413","0417","0420","0427","0444","0445","0447","0448","0450","0452","0453","0454","0455","0457","0460","0470","0471","0475","0477","0478","0480","0486","0488","0490","0493","0495","0499","0500","0501","0502","0504","0505","0508","0509","0510","0511","0513","0515","0518","0520","0522","0523","0524","0525","0530","0531","0535","0538","0539","0544","0546","0547","0548","0549","0580","0600","0606","0607","0610","0620","0625","0627","0648","0652","0653","0654","0680","0696","0697","0970","0971","0972","0973","0976","0977","0978","0979","0980","0983","0984","0985","0986","0987","0989","0990","0991","0992","0993","0994","0995","7156","7159","7160","7164","7184"],
	[Level.A_LEVELS]: ["8001","8004","8021","8024","8041","8053","8058","8281","8291","8663","8665","8670","8672","8673","8675","8679","8680","8681","8682","8683","8684","8685","8686","8687","8689","8695","8779","9011","9013","9014","9084","9093","9231","9239","9274","9336","9389","9395","9396","9479","9481","9482","9483","9484","9488","9489","9607","9608","9609","9618","9626","9631","9676","9679","9680","9686","9687","9689","9691","9693","9694","9695","9696","9698","9699","9700","9701","9702","9703","9704","9705","9706","9707","9708","9709","9713","9715","9716","9717","9718","9719","9980","9990"],
};

//TODO fully cleanup: this is the GCEGuide name, we should use the rawsubjectdata name
export const subjectNamesXtremePapers: Record<string, string> = {
	//copy(JSON.stringify(Object.fromEntries(Array.from(document.querySelectorAll("a.directory")).slice(1).map(a => a.href.split("https://papers.xtremepape.rs/index.php?dirpath=./CAIE/IGCSE/")[1].split("/&order=0")[0]).map(c => [c.match(/%28(\d+)%29/)?.[1], decodeURIComponent(c).replaceAll("+", " ")]).filter(a => a[0]).sort(([a], [b]) => +a - +b))))
	//copy(JSON.stringify(Object.fromEntries(Array.from(document.querySelectorAll("a.directory")).slice(1).map(a => a.href.split("https://papers.xtremepape.rs/index.php?dirpath=./CAIE/AS+and+A+Level/")[1].split("/&order=0")[0]).map(c => [c.match(/%28(\d+)%29/)?.[1], decodeURIComponent(c).replaceAll("+", " ")]).filter(a => a[0]).sort(([a], [b]) => +a - +b))))
	//IGCSE
	"7156":"French (9-1) (7156)","7159":"German (9-1) (7159)","7160":"Spanish (9-1) (7160)","7164":"Italian (9-1) (7164)","7184":"Arabic - First Language (9-1) (7184)","0262":"Swahili (0262)","0400":"Art & Design (0400)","0408":"World Literature (0408)","0409":"History - American (US) (0409)","0410":"Music (0410)","0411":"Drama (0411)","0413":"Physical Education (0413)","0417":"Information and Communication Technology (0417)","0420":"Computer Studies (0420)","0427":"English - Literature (US) (0427)","0444":"Mathematics (US) (0444)","0445":"Design & Technology (0445)","0447":"India Studies (0447)","0448":"Pakistan Studies (0448)","0450":"Business Studies (0450)","0452":"Accounting (0452)","0453":"Development Studies (0453)","0454":"Enterprise (0454)","0455":"Economics (0455)","0457":"Global Perspectives (0457)","0460":"Geography (0460)","0470":"History (0470)","0471":"Travel & Tourism (0471)","0475":"English - Literature in English (0475)","0477":"English - Literature (9-1) (UK only) (0477)","0478":"Computer Science (0478)","0480":"Latin (0480)","0486":"English - Literature (0486)","0488":"Spanish - Literature (0488)","0490":"Religious Studies (0490)","0493":"Islamiyat (0493)","0495":"Sociology (0495)","0499":"Sanskrit (0499)","0500":"English - First Language (0500)","0501":"French - First Language (0501)","0502":"Spanish - First Language (0502)","0504":"Portuguese - First Language (0504)","0505":"German - First Language (0505)","0508":"Arabic - First Language (0508)","0509":"Chinese - First Language (0509)","0510":"English as a Second Language (Speaking endorsement) (0510)","0511":"English as a Second Language (Count-in speaking) (0511)","0513":"Turkish - First Language (0513)","0515":"Dutch - Foreign Language (0515)","0518":"Thai - First Language (0518)","0520":"French - Foreign Language (0520)","0522":"English - First Language (UK) (0522)","0523":"Chinese - Second Language (0523)","0524":"English - First Language (US) (0524)","0525":"German - Foreign Language (0525)","0530":"Spanish - Foreign Language (0530)","0531":"IsiZulu as a Second Language (0531)","0535":"Italian - Foreign Language (0535)","0538":"Bahasa Indonesia (0538)","0539":"Urdu as a Second Language (0539)","0544":"Arabic - Foreign Language (0544)","0546":"Malay - Foreign Language (0546)","0547":"Chinese (Mandarin) - Foreign Language (0547)","0548":"Afrikaans - Second Language (0548)","0549":"Hindi as a Second Language (0549)","0580":"Mathematics (0580)","0600":"Agriculture (0600)","0606":"Mathematics - Additional (0606)","0607":"Mathematics - International (0607)","0610":"Biology (0610)","0620":"Chemistry (0620)","0625":"Physics (0625)","0627":"English - First Language (9-1) (UK only) (0627)","0648":"Food & Nutrition (0648)","0652":"Physical Science (0652)","0653":"Science - Combined (0653)","0654":"Sciences - Co-ordinated (Double) (0654)","0680":"Environmental Management (0680)","0696":"Malay - First Language (0696)","0697":"Marine Science (0697)","0970":"Biology (9-1) (0970)","0971":"Chemistry (9-1) (0971)","0972":"Physics (9-1) (0972)","0973":"Sciences - Co-ordinated (9-1) (0973)","0976":"Geography (9-1) (0976)","0977":"History (9-1) (0977)","0978":"Music (9-1) (0978)","0979":"Design & Technology (9-1) (0979)","0980":"Mathematics (9-1) (0980)","0983":"Information and Communication Technology (9-1) (0983)","0984":"Computer Science (9-1) (0984)","0985":"Accounting (9-1) (0985)","0986":"Business Studies (9-1) (0986)","0987":"Economics (9-1) (0987)","0989":"Art & Design (9-1) (0989)","0990":"English - First Language (9-1) (0990)","0991":"English - Second Language (9-1) (0991)","0992":"English - Literature in English (9-1) (0992)","0993":"English as a Second Language (Speaking endorsement) (9-1) (0993)","0994":"Drama (9-1) (0994)","0995":"Physical Education (9-1) (0995)",
	//A level
	"8001":"General Paper 8001 (AS Level only) (8001)","8004":"General Paper 8004 (AS Level only) (8004)","8021":"English General Paper (AS Level only) (8021)","8024":"Nepal Studies (AS Level only) (8024)","8041":"Divinity (AS Level only) (8041)","8053":"Islamic Studies (9013 & 8053)","8058":"Hinduism (AS level only) (8058)","8281":"Japanese Language (AS Level only) (8281)","8291":"Environmental Management (AS only) (8291)","8663":"Music (AS Level only) (8663)","8665":"Spanish - First Language (AS Level only) (8665)","8670":"French - Literature (AS Level only) (8670)","8672":"Portuguese - Literature (AS Level only) (8672)","8673":"Spanish - Literature (AS Level only) (8673)","8675":"Hindi - Literature (AS Level only) (8675)","8679":"Afrikaans - Language (AS Level only) (8679)","8680":"Arabic - Language (AS Level only) (8680)","8681":"Chinese - Language (AS Level only) (8681)","8682":"French - Language (AS Level only) (8682)","8683":"German - Language (AS Level only) (8683)","8684":"Portuguese - Language (AS Level only) (8684)","8685":"Spanish - Language (AS Level only) (8685)","8686":"Urdu - Language (AS Level only) (8686)","8687":"Hindi - Language (AS Level only) (8687)","8689":"Tamil - Language (AS Level only) (8689)","8695":"English - Language and Literature (AS Level only) (8695)","8779":"Afrikaans - First Language (AS Level only) (8779)","9011":"Divinity (9011)","9013":"Islamic Studies (9013 & 8053)","9014":"Hinduism (9014)","9084":"Law (9084)","9093":"English Language (9093)","9231":"Mathematics - Further (9231)","9239":"Global Perspectives & Research (9239)","9274":"Classical Studies (9274)","9336":"Food Studies (9336)","9389":"History (for final examination in 2021) (9389)","9395":"Travel & Tourism (9395)","9396":"Physical Education (9396)","9479":"Art & Design (9479)","9481":"Digital Media & Design (9481)","9482":"Drama (9482)","9483":"Music (9483)","9484":"Biblical Studies (9484)","9488":"Islamic Studies (9488)","9489":"History (9489)","9607":"Media Studies (9607)","9608":"Computer Science (for final examination in 2021) (9608)","9609":"Business (9609)","9618":"Computer Science (for first examination in 2021) (9618)","9626":"Information Technology (9626)","9631":"Design & Textiles (9631)","9676":"Urdu (A Level only) (9676)","9679":"Afrikaans (9679)","9680":"Arabic (9680)","9686":"Urdu - Pakistan only (A Level only) (9686)","9687":"Hindi (A Level only) (9687)","9689":"Tamil (9689)","9691":"Computing (9691)","9693":"Marine Science (9693)","9694":"Thinking Skills (9694)","9695":"English - Literature (9695)","9696":"Geography (9696)","9698":"Psychology (9698)","9699":"Sociology (9699)","9700":"Biology (9700)","9701":"Chemistry (9701)","9702":"Physics (9702)","9703":"Music (9703)","9704":"Art & Design (9704)","9705":"Design and Technology (9705)","9706":"Accounting (9706)","9707":"Business Studies  (9707)","9708":"Economics (9708)","9709":"Mathematics (9709)","9713":"Applied Information and Communication Technology (9713)","9715":"Chinese (A Level only) (9715)","9716":"French (A Level only) (9716)","9717":"German (A Level only) (9717)","9718":"Portuguese (A Level only) (9718)","9719":"Spanish (A Level only) (9719)","9980":"Cambridge International Project Qualification (9980)","9990":"Psychology (9990)",
};
export const subjectNamesGce: Record<string, string> = {
	//copy(JSON.stringify(Object.fromEntries(Array.from(document.querySelectorAll("#paperslist a")).map(a => a.href.split("https://papers.gceguide.cc/cambridge-IGCSE/")[1]).map(c => [c.match(/\((\d+)\)/)?.[1], c]).sort(([a], [b]) => +a - +b))))
	//copy(JSON.stringify(Object.fromEntries(Array.from(document.querySelectorAll("#paperslist a")).map(a => a.href.split("https://papers.gceguide.cc/a-levels/")[1]).map(c => [c.match(/\((\d+)\)/)?.[1], c]).sort(([a], [b]) => +a - +b))))
	//IGCSE
	"8001":"general-paper-(AS-level-only)-(8001)","8004":"general-paper-(AS-level-only)-(8004)","8021":"english-general-paper-(AS-level-only)-(8021)","8024":"nepal-studies(AS-level-only)-(8024)","8041":"divinity-(AS-level-only)-(8041)","8053":"islamic-studies-(AS-level-only)-(8053)","8058":"hinduism-(AS-level-only)-(8058)","8281":"japanese-language-(AS-level-only)-(8281)","8291":"environmental-management-(AS-only)-(8291)","8663":"music-(AS-level-only)-(8663)","8665":"spanish-first-language-(AS-level-only)-(8665)","8670":"french-literature-(AS-level-only)-(8670)","8672":"portuguese-literature-(AS-level-only)-(8672)","8673":"spanish-literature-(AS-level-only)-(8673)","8675":"hindi-literature-(AS-level-only)-(8675)","8679":"afrikaans-language-(AS-level-only)-(8679)","8680":"arabic-language-(AS-level-only)-(8680)","8681":"chinese-language-(AS-level-only)-(8681)","8682":"french-language-(AS-level-only)-(8682)","8683":"german-language-(AS-level-only)-(8683)","8684":"portuguese-language-(AS-level-only)-(8684)","8685":"spanish-language-(AS-level-only)-(8685)","8686":"urdu-language-(AS-level-only)-(8686)","8687":"hindi-language-(AS-level-only)-(8687)","8689":"tamil-language-(AS-level-only)-(8689)","8695":"english-language-&-literature-(AS-level-only)-(8695)","8779":"afrikaans-first-language-(AS-level-only)-(8779)","9011":"divinity-(9011)","9013":"islamic-studies-(9013)","9014":"hinduism-(9014)","9084":"law-(9084)","9093":"english-language-(9093)","9231":"mathematics-further-(9231)","9239":"global-perspectives-&-research-(9239)","9274":"classical-studies-(9274)","9336":"food-studies-(9336)","9389":"history-(9389)","9395":"travel-&-tourism-(9395)","9396":"physical-education-(9396)","9479":"art-&-design-(9479)","9481":"digital-media-&-design-(9481)","9482":"drama-(9482)","9483":"music-(9483)","9484":"biblical-studies-(9484)","9488":"islamic-studies-(9488)","9489":"history-(9489)","9607":"media-studies-(9607)","9608":"computer-science-(9608)","9609":"business-(9609)","9618":"computer-science-(9618)","9626":"information-technology-(9626)","9631":"design-&-textiles-(9631)","9676":"urdu-(A-level-only)-(9676)","9679":"afrikaans-(9679)","9680":"arabic-(9680)","9686":"urdu-pakistan-only-(A-level-only)-(9686)","9687":"hindi-(A-level-only)-(9687)","9689":"tamil-(9689)","9691":"computing-(9691)","9693":"marine-science-(9693)","9694":"thinking-skills-(9694)","9695":"english-literature-(9695)","9696":"geography-(9696)","9698":"psychology-(9698)","9699":"sociology-(9699)","9700":"biology-(9700)","9701":"chemistry-(9701)","9702":"physics-(9702)","9703":"music-(9703)","9704":"art-&-design-(9704)","9705":"design-&-technology-(9705)","9706":"accounting-(9706)","9707":"business-studies-(9707)","9708":"economics-(9708)","9709":"mathematics-(9709)","9713":"applied-Information-and-communication-technology-(9713)","9715":"chinese-(A%20level%20only)-(9715)","9716":"french-(A-level-only)-(9716)","9717":"german-(A-level-only)-(9717)","9718":"portuguese-(A-level-only)-(9718)","9719":"spanish-(A-level-only)-(9719)","9980":"cambridge-international-project-qualification-(9980)","9990":"psychology-(9990)",
	//A levels
	"7156":"french-(9-1)-(7156)","7159":"german-(9-1)-(7159)","7160":"spanish-(9-1)-(7160)","7164":"italian-(9-1)-(7164)","7184":"arabic-first-language-(9-1)-(7184)","0262":"swahili-(0262)","0400":"art-&-design-(0400)","0408":"world-literature-(0408)","0409":"history-american-(US)-(0409)","0410":"music-(0410)","0411":"drama-(0411)","0413":"physical-education-(0413)","0417":"information-&-communication-technology-(0417)","0420":"computer-studies-(0420)","0427":"english-literature-(US)-(0427)","0444":"mathematics-(US)-(0444)","0445":"design-&-technology-(0445)","0447":"india-studies-(0447)","0448":"pakistan-studies-(0448)","0450":"business-studies-(0450)","0452":"accounting-(0452)","0453":"development-studies-(0453)","0454":"enterprise-(0454)","0455":"economics-(0455)","0457":"global-perspectives-(0457)","0460":"geography-(0460)","0470":"history-(0470)","0471":"travel-&-tourism-(0471)","0475":"english-literature-in-english-(0475)","0477":"english-literature-(9-1)-(UK%20only)-(0477)","0478":"computer-science-(0478)","0480":"latin-(0480)","0486":"english-literature-(0486)","0488":"spanish-literature-(0488)","0490":"religious-studies-(0490)","0493":"islamiyat-(0493)","0495":"sociology-(0495)","0499":"sanskrit-(0499)","0500":"english-first-language-(0500)","0501":"french-first-language-(0501)","0502":"spanish-first-language-(0502)","0504":"portuguese-first-language-(0504)","0505":"german-first-language-(0505)","0508":"arabic-first-language-(0508)","0509":"chinese-first-language-(0509)","0510":"english-as-a-second-language-(speaking-endorsement)-(0510)","0511":"english-as-a-second-language-(count-in-speaking)-(0511)","0513":"turkish-first-language-(0513)","0515":"dutch-foreign-language-(0515)","0518":"thai-first-language-(0518)","0520":"french-foreign-language-(0520)","0522":"english-first-language-(UK)-(0522)","0523":"chinese-second-language-(0523)","0524":"english-first-language-(US)-(0524)","0525":"german-foreign-language-(0525)","0530":"spanish-foreign-language-(0530)","0531":"isiZulu-as-a-second-language-(0531)","0535":"italian-foreign-language-(0535)","0538":"bahasa-indonesia-(0538)","0539":"urdu-as-a-second-language-(0539)","0544":"arabic-foreign-language-(0544)","0546":"malay-foreign-language-(0546)","0547":"chinese-(mandarin)-foreign-language-(0547)","0548":"afrikaans-second-language-(0548)","0549":"hindi-as-a-second-language-(0549)","0580":"mathematics-(0580)","0600":"agriculture-(0600)","0606":"mathematics-additional-(0606)","0607":"mathematics-international-(0607)","0610":"biology-(0610)","0620":"chemistry-(0620)","0625":"physics-(0625)","0627":"english-first-language-(9-1)-(UK-only)-(0627)","0648":"food-&-nutrition-(0648)","0652":"physical-science-(0652)","0653":"science-combined-(0653)","0654":"sciences-co-ordinated-(double)-(0654)","0680":"environmental-management-(0680)","0696":"malay-first-language-(0696)","0697":"marine-science-(0697)","0970":"biology-(9-1)-(0970)","0971":"chemistry-(9-1)-(0971)","0972":"physics-(9-1)-(0972)","0973":"sciences-co-ordinated-(9-1)-(0973)","0976":"geography-(9-1)-(0976)","0977":"history-(9-1)-(0977)","0978":"music-(9-1)-(0978)","0979":"design-&-technology-(9-1)-(0979)","0980":"mathematics-(9-1)-(0980)","0983":"information-&-communication-technology-(9-1)-(0983)","0984":"computer-science-(9-1)-(0984)","0985":"accounting-(9-1)-(0985)","0986":"business-studies-(9-1)-(0986)","0987":"economics-(9-1)-(0987)","0989":"art-&-design-(9-1)-(0989)","0990":"english-first-language-(9-1)-(0990)","0991":"english-second-language-(9-1)-(0991)","0992":"english-literature-in-english-(9-1)-(0992)","0993":"english-as-a-second-language-(speaking-endorsement)-(9-1)-(0993)","0994":"drama-(9-1)-(0994)","0995":"physical-education-(9-1)-(0995)",
};

export const subjectMapping = Object.fromEntries(
	Object.entries(subjectIDs).map(([level, data]) =>
		data.map(id => [id, {
			level,
			id,
			name: subjectNamesXtremePapers[id] ?? impossible(),
		}] as const),
	).flat()
);
//todo properly store data... use transformer to handle the funny german typo
export const syllabusData:Record<string, string[]> = {
	//AS A level
	"8021":["557265-2022-2024","664519-2025-2027"],"8022":["635236-2024-2026"],"8027":["663716-2025-2027"],"8028":["664288-2025-2027"],"8238":["635239-2024-2026"],"8281":["597284-2023"],"8291":["557262-2022-2024","664522-2025-2027"],"8386":["635241-2024-2026"],"8665":["597291-2023"],"8673":["597365-2023"],"8675":["597294-2023"],"8679":["597297-2023-2024","664524-2025-2026"],"8680":["597350-2023-2024","664527-2025"],"8681":["597353-2023"],"8682":["597356-2023","635867-2024"],"8683":["https://www.cambridgeinternational.org/Images/597359-2023-2024-syllabus-.pdf"],"8684":["597362-2023","635874-2024","664529-2025"],"8685":["597365-2023"],"8686":["597371-2023","635890-2024","664531-2025-2026"],"8687":["597375-2023"],"8689":["597378-2023","635894-2024-2025"],"8695":["502929-2021-2023","635896-2024-2026"],"9084":["595453-2023-2025"],"9093":["502932-2021-2023","635901-2024-2026"],"9231":["597381-2023-2025"],"9239":["595455-2023-2025"],"9274":["557256-2022-2024","664534-2025-2027"],"9395":["597384-2023","634457-2024-2026"],"9396":["597683-2023"],"9479":["557248-2022-2024","664536-2025"],"9481":["557245-2022-2024","664544-2025"],"9482":["554592-2021-2023","635919-2024-2026"],"9483":["557243-2022-2024","664546-2025-2026"],"9484":["596449-2023","636040-2024-2026"],"9487":["521992-2021-2023","636056-2024-2025"],"9488":["502933-2021-2023","636058-2024-2026"],"9489":["502955-2021-2023","636122-2024-2025"],"9607":["502957-2021-2023","636087-2024-2026"],"9608":["502960-2021"],"9609":["595459-2023-2025"],"9618":["502962-2021-2023","636089-2024-2025"],"9626":["554602-2022-2024","662482-2025-2027"],"9631":["557238-2022-2023"],"9676":["597387-2023","636091-2024"],"9680":["597390-2023-2024","664549-2025"],"9686":["597395-2023","636093-2024","664551-2025-2026"],"9687":["597402-2023"],"9689":["597409-2023","636095-2024-2025"],"9693":["554604-2022-2024","664553-2025-2027"],"9694":["597412-2023-2025"],"9695":["502967-2021-2023","636097-2024-2026"],"9696":["597415-2023-2024","664556-2025-2026"],"9699":["502972-2021-2023","636099-2024-2026"],"9700":["554607-2022-2024","664560-2025-2027"],"9701":["554616-2022-2024","664563-2025-2027"],"9702":["554625-2022-2024","664565-2025-2027"],"9705":["597418-2023","651351-2024","675267-2025-2027"],"9706":["595461-2023-2025"],"9708":["595463-2023-2025"],"9709":["597421-2023-2025"],"9715":["597423-2023"],"9716":["597426-2023","636101-2024"],"9717":["597429-2023-2024"],"9718":["597432-2023","636103-2024","664567-2025"],"9719":["597443-2023"],"9844":["649879-2024-2026"],"9868":["649875-2024-2026"],"9897":["664366-2025-2027"],"9898":["664368-2025-2027"],"9990":["502977-2021-2023","634461-2024-2026"],
	//IGCSE
	"7156":["557182-2022-2024","664663-2025-2027"],"7159":["557185-2022-2024","664665-2025-2027"],"7160":["557188-2022-2024","664667-2025-2027"],"7164":["557191-2022-2024","664669-2025-2027"],"7184":["557197-2022-2023","635845-2024-2025","697270-2026"],"0452":["596935-2023-2025","697149-2026"],"0985":["597108-2023-2025","697252-2026"],"0548":["663200-2023-2024","663202-2025-2027"],"0600":["597040-2023","635762-2024-2025","697200-2026"],"0508":["556901-2022-2023","635760-2024-2025","697182-2026"],"0544":["556993-2022-2024","664635-2025-2027"],"0400":["596905-2023","635731-2024","664588-2025","697135-2026"],"0989":["597132-2023","635780-2024","664655-2025","697261-2026"],"0538":["556142-2022-2024","664631-2025-2027"],"0610":["595426-2023-2025","697203-2026-2028"],"0970":["697234-2026-2028"],"0450":["596930-2023-2025","697146-2026"],"0986":["597113-2023-2025","697256-2026"],"0620":["595428-2023-2025","697205-2026-2028"],"0971":["595434-2023-2025","697236-2026-2028"],"0509":["596963-2023-2025","697185-2026-2027"],"0523":["596966-2023-2025","697191-2026-2027"],"0547":["554588-2022-2024","664639-2025-2027"],"0478":["595424-2023-2025","697167-2026-2028"],"0984":["595440-2023-2025","697248-2026-2028"],"0445":["652361-2023","635750-2024-2026"],"0979":["597100-2023","635778-2024-2026"],"0411":["554581-2022-2024","664602-2025-2027"],"0994":["554650-2022-2024","664659-2025-2027"],"0455":["596945-2023-2025","697154-2026"],"0987":["597118-2023-2025","697258-2026"],"0500":["596961-2023","635230-2024-2026"],"0990":["414546-2020-2022","597137-2023","635234-2024-2026"],"0524":["596968-2023","635232-2024","664622-2025-2027"],"0427":["596917-2023","635747-2024"],"0475":["596436-2023-2025","697163-2026"],"0992":["596445-2023-2025","697264-2026"],"0472":["610940-2023-2025","697158-2026-2028"],"0772":["635395-2023-2025","697231-2026-2028"],"0465":["662459-2024-2026"],"0511":["556911-2022-2023","637163-2024-2026"],"0991":["557045-2022-2023","637361-2024-2026"],"0510":["556906-2022-2023","637160-2024-2026"],"0993":["557051-2022-2023","637363-2024-2026"],"0454":["596938-2023","636114-2024-2025","697151-2026"],"0680":["557023-2022-2024","664643-2025-2026"],"0648":["597055-2023-2025","697228-2026-2028"],"0501":["697179-2026"],"0520":["556974-2022-2024","664620-2025-2027"],"0460":["596947-2023","636118-2024","664610-2025-2026"],"0976":["597082-2023","635766-2024","664647-2025-2026"],"0505":["596442-2023-2025","697181-2026"],"0525":["556981-2022-2024","664624-2025-2027"],"0457":["555760-2022-2024","662457-2025-2027"],"0549":["597032-2023-2025","697196-2026"],"0470":["596950-2023","649636-2024-2026"],"0409":["555747-2022-2024","664594-2025-2027"],"0977":["597087-2023","649638-2024-2026"],"0417":["595352-2023-2025","697139-2026-2028"],"0983":["595438-2023-2025","697246-2026-2028"],"0531":["663182-2023-2024","663184-2025-2027"],"0493":["635758-2024-2025","697174-2026-2027"],"0535":["556986-2022-2024","664629-2025-2027"],"0480":["596955-2023-2025","697172-2026-2028"],"0696":["664645-2025-2027"],"0546":["554587-2022-2024","664637-2025-2027"],"0697":["597073-2023","634451-2024-2026"],"0580":["597037-2023-2024","662466-2025-2027"],"0606":["597045-2023-2024","662470-2025-2027"],"0607":["597050-2023-2024","662472-2025-2027"],"0980":["597105-2023-2024","663105-2025-2027"],"0444":["573813-2022-2024","706337-2025"],"0410":["596914-2023","635739-2024","664596-2025","694052-2026-2028"],"0978":["597093-2023","635771-2024","664651-2025","694054-2026-2028"],"0448":["596925-2023","635752-2024","664608-2025","697142-2026"],"0413":["555751-2022-2024","664604-2025-2026"],"0995":["557055-2022-2024","664661-2025-2026"],"0652":["597060-2023-2024","664641-2025-2026"],"0625":["595430-2023-2025"],"0972":["595436-2023-2025"],"0504":["556888-2022-2024","663168-2025-2027"],"0490":["556870-2022-2023","635755-2024","663158-2025-2027"],"0499":["556874-2022-2024","664612-2025-2027"],"0653":["597065-2023-2024","662474-2025-2027"],"0973":["597076-2023-2024","664570-2025-2027"],"0654":["597069-2023-2024","664572-2025-2027"],"0698":["663220-2025-2027"],"0495":["596957-2023-2024","662464-2025-2027"],"0502":["554582-2022-2024","664614-2025-2027"],"0530":["556984-2022-2024","664626-2025-2027"],"0488":["568948-2022-2023","635753-2024"],"0474":["663145-2025-2027"],"0262":["555741-2022-2024","664586-2025-2027"],"0518":["556971-2022-2024","664618-2025-2027"],"0471":["596953-2023","634449-2024-2026"],"0513":["646464-2022-2024","664970-2025-2027"],"0539":["556991-2022-2024","664633-2025-2027"],"0695":["683274-2025-2027"],"0408":["555745-2022-2024","664592-2025-2027"]
};
export const shorthandSubjectNames = ((data:{
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
		"0530": ["spanish"],
		"0580": ["math", "mathematics"],
		"0620": ["chem", "chemistry"],
		"0625": ["phy", "phys", "physics"],
		"0417": ["ict"],
		"0478": ["cs", "compsci"],
		"0610": ["bio", "biology"],
		"0455": ["eco", "economics"],
		"0500": ["eng", "english", "el"],
		"0606": ["meth", "add math", "addmath"],
		"0680": ["evm", "env"],
	},
	[Level.A_LEVELS]: {
		"8021": ["ge", "eg", "egp"],
		"8291": ["evm", "env"],
		"9700": ["bio", "biology"],
		"9701": ["chem", "chemistry"],
		"9702": ["phy", "phys", "physics"],
		"9708": ["eco"],
		"9709": ["math", "mathematics"],
		"9093": ["eng", "english", "el"],
		"9608": ["cso", "ocs"],
		"9618": ["cs", "compsci"], //changes to 9608 if season is 2020 or earlier with special handling
		"9231": ["further math", "f math", "fmath", "math f", "mathf", "math further", "meth"],
		"9990": ["psy", "psych", "psycho", "psychology"],
	},
});
