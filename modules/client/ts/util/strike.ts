export interface Strike {
	GameNo: string;
	RallyNo: string;
	StrikeNo: string;
	BallPosition: string;
	ScoreA1: string;
	ScoreB1: string;
	ScoreA2: string;
	ScoreB2: string;
	HitPlayer: string;
	NextBallPosition: string;
	StrikeTech: string;
	NextStrikeTech: string;
	GameAction: string;
	NextGameAction: string;
	StrikeEffect: string;
	NextStrikeEffect: string;
	SpinKind: string;
	NextSpinKind: string;
}

export interface Rally {
	GameNo: string;
	RallyNo: string;
	Strikes: Strike[];
	WinPlayer?: string;
	StartPlayer?: string;
	ScoreA?: number;
	ScoreB?: number;
}

export interface Tactic {
	startStrike: number,
	ballPositions: number[],
	strikeTechs: number[]
}