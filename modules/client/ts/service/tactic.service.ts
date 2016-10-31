import { Injectable } from '@angular/core';

import { Strike, Rally, Tactic } from '../util/strike';
import { Status } from '../util/status';

@Injectable()
export class TacticService {

	constructor() {
	}

	Ball2Table(po: string): number {
		// return parseInt(po);
		let hand = 1;
		if (po === '1') return 1+hand;
		if (po === '2') return 16-hand;
		if (po === '3') return 1-hand;
		if (po === '4') return 16+hand;
		if (po === '5') return 10+hand;
		if (po === '6') return 7-hand;
		if (po === '7') return 13+hand;
		if (po === '8') return 4-hand;
		if (po === '9') return 16+hand;
		if (po === '10') return 1-hand;
		if (po === '11') return 10;
		if (po === '12') return 7;
		if (po === '13') return 13;
		if (po === '14') return 4;
		if (po === '15') return 16;
		if (po === '16') return  1;
		if (po === '17') return 10-hand;
		if (po === '18') return 7+hand;
		if (po === '19') return 13-hand;
		if (po === '20') return 4+hand;
		if (po === '21') return 16-hand;
		if (po === '22') return 1+hand;
		if (po === '23') return -1;
		if (po === '24') return -2;
		if (po === '25') return -3;
		if (po === '26') return -4;
		return -10000;
	}

	extractRallies(_: Strike[]): Rally[] {
		let result: Rally[] = [];
		let counter:number = -1;
		_.forEach((_) => {
			if(result[counter] && 
				result[counter].GameNo === _.GameNo &&
				result[counter].RallyNo === _.RallyNo) {
				result[counter].Strikes.push(_);
			} else if(_ && _.RallyNo !== '0') {
				result.push({
					'GameNo': _.GameNo,
					'RallyNo': _.RallyNo,
					'Strikes': [_]
				});
				counter++;
			}
		});
		result.forEach((_) => {
			let strikes = _.Strikes;
			_.WinPlayer = strikes[strikes.length - 1].NextBallPosition === '25' ? 'A' : 'B';
			_.StartPlayer = strikes[0].BallPosition === '1' ? 'A' : 'B';
			_.ScoreA = parseInt(strikes[0].ScoreA1);
			_.ScoreB = parseInt(strikes[0].ScoreB1);
		});
		return result;
	}

	//只考虑了击球技术的发球战术，接发球战术
	extractTactic(_: Rally): string[] {
		let tactic1: string;
		let tactic2: string;
		if(!_) return [tactic1, tactic2];
		if (_.Strikes.length >= 3) {
			tactic1 = _.Strikes.slice(0, 3).map(d => Math.floor(parseInt(d.StrikeTech)/2)).join(',');
		}
		if (_.Strikes.length >= 4) {
			tactic2 = _.Strikes.slice(1, 4).map(d => Math.floor(parseInt(d.StrikeTech)/2)).join(',');
		}
		return [tactic1, tactic2];
	}

	//细节的战术
	extractTacticDetail(_: Rally): Tactic[] {
		let tactic1: Tactic,
				tactic2: Tactic;
		if (_.Strikes.length >= 3) {
			let ballPos: number[] = _.Strikes.slice(0, 3).map((d) => {
				return parseInt(d.BallPosition);
			});
			let strikeTech: number[] = _.Strikes.slice(0, 3).map((d) => {
				return Math.floor(parseInt(d.StrikeTech) / 2);
			});
			tactic1 = {
				startStrike: 0,
				ballPositions: ballPos,
				strikeTechs: strikeTech
			}
		}
		if (_.Strikes.length >= 4) {
			let ballPos: number[] = _.Strikes.slice(1, 4).map((d) => {
				return parseInt(d.BallPosition);
			});
			let strikeTech: number[] = _.Strikes.slice(1, 4).map((d) => {
				return Math.floor(parseInt(d.StrikeTech) / 2);
			});
			tactic2 = {
				startStrike: 1,
				ballPositions: ballPos,
				strikeTechs: strikeTech
			}
		}
		return [tactic1, tactic2];
	}

	//发球抢攻，接发球抢攻
	extractGameStatus(_: Rally, respect: string): Status {
		let strikes: Strike[] = _.Strikes;
		if (_.StartPlayer === respect) {

		} else {

		}
		let Score = respect === 'A' ? '25' : '26';
		let lastStrike = strikes[strikes.length - 1];
		let lastStrikePlayer = parseInt(lastStrike.BallPosition) % 2 === 0 ? 'A' : 'B';
		let isServe = respect === _.StartPlayer; //是否是发球轮
		if (isServe) {
			//得分
			if (lastStrike.NextBallPosition === Score) {
				//对方接发球失误
				if (strikes.length <= 2) return Status.Ap;
				//对方第四拍失误
				if (strikes.length <= 4) return Status.Bp;
				//对方第六拍失误
				if (strikes.length <= 6) return Status.Cp;
				//对方第六拍以后失误
				return Status.Dp;
			}
			//失分 
			else { 
				if (strikes.length === 1) return Status.Am;
				if (strikes.length <= 3) return Status.Bm;
				if (strikes.length <= 5) return Status.Cm;
				return Status.Dm;
			}
		} else {
			//得分
			if (lastStrike.NextBallPosition === Score) {
				//对方第三拍失误
				if (strikes.length <= 3 && strikes.length > 1) return Status.Xp;
				//对方第五拍失误
				if (strikes.length <= 5) return Status.Yp;
				//对方第五拍以后失误
				return Status.Zp;
			}
			//失分 
			else { 
				if (strikes.length <= 2) return Status.Xm;
				if (strikes.length <= 4) return Status.Ym;
				return Status.Zm;
			}			
		}
	}

	isPhase1(_: Status): boolean {
		if (_ === Status.Ap ||
				_ === Status.Am ||
				_ === Status.Bp ||
				_ === Status.Bm ||
				_ === Status.Cm
			) {
			return true;
		}
		return false;
	}

	isPhase2(_: Status): boolean {
		if (_ === Status.Xp ||
				_ === Status.Xm ||
				_ === Status.Yp ||
				_ === Status.Ym 
			) {
			return true;
		}
		return false;
	}

	isPhase3(_: Status): boolean {
		if (_ === Status.Cp ||
				_ === Status.Dp ||
				_ === Status.Dm ||
				_ === Status.Zp ||
				_ === Status.Zm
			) {
			return true;
		}
		return false;
	}
}