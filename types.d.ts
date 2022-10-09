
interface PasapaporDatabase {
	[subjectID:string]: {
		[year:string]: {
			[code:string]: PasapaporData;
		}
	};
}
interface PasapaporData {
	status: "in_progress" | "complete";
	/**Unix timestamp of the date, filled in with Date.now() */
	date: number;
}

interface SubjectMapping {
	[id: string]: SubjectData;
}

interface SubjectData {
	level: Level;
	name: string;
}
