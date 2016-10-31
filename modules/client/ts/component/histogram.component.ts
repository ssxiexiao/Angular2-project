import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Strike, Rally } from '../util/strike';
import { Status } from '../util/status';
import { Rect } from '../util/svg.interface';
import { RequestService } from '../service/request.service';
import { TacticService } from '../service/tactic.service';
import { Histogram } from '../layout/histogram.layout';

@Component({
	selector: 'histogram',
	templateUrl: '../modules/client/templates/histogram.component.html' ,
	styleUrls: [ '../modules/client/styles/histogram.component.css' ]
})
export class HistogramComponent implements OnInit {

	title: string = 'My App';
	strikes: Strike[] = [];
	rallies: Rally[] = [];
	rectAs: Rect[] = [];
	rectBs: Rect[] = [];

	private histogramA: Histogram;
	private histogramB: Histogram;

	private _onSelectRallyEle: Rally;
	private _onSelectRallyTac: string[];
	private _onSelectPhase: string[];

	@Output()
	rallySelected = new EventEmitter();

	statusOption: string = '默认';

	constructor(
		private requestService: RequestService,
		private tacticService: TacticService) {}

	getData(): void {
		this.requestService.getData()
									 	   .then((data) => {
									 		 		this.strikes = data;
									 		 		this.rallies = this.tacticService.extractRallies(data);
									 		 		this.histogramA.dataset(this.rallies);
									 		 		this.histogramB.dataset(this.rallies);
									 		 		this.layout();
									 		 		console.log(this.rallies.length);
									 		 });
	}

	layout(): void {
		let cbA = function(d: Rally) {
			if (d.WinPlayer === 'A') return d.ScoreA + 1;
			return d.ScoreA;
		};
		let cbB = function(d: Rally) {
			if (d.WinPlayer === 'B') return d.ScoreB + 1;
			return d.ScoreB;
		}
		this.rectAs = this.histogramA.histogrm(cbA);
		this.rectBs = this.histogramB.histogrm(cbB);
	}

	getRect(d: Rally, i: number, option: string): Rect {
		if (option === 'A')
			return this.rectAs[i];
		return this.rectBs[i];
	}

	onSelectRally(_: Rally): void {
		this._onSelectRallyEle = _;
		this._onSelectRallyTac = this.tacticService.extractTactic(_);
		this.rallySelected.emit(this.getSameTacticRallies());
	}

	//只考虑了击球技术的战术
	hasSameTactic(_: Rally): boolean {
		if (!this._onSelectRallyEle || _.StartPlayer !== this._onSelectRallyEle.StartPlayer) 
			return false;
		let tactics1 = this.tacticService.extractTactic(_),
				tactics2 = this._onSelectRallyTac;
		if (tactics1[0] && tactics1[0] === tactics2[0])
			return true;
		else if (tactics1[1] && tactics1[1] === tactics2[1])
			return true;
		else 
			return false;
	}

	getSameTacticRallies(): Rally[] {
		let result: Rally[] = [];
		this.rallies.forEach((d) => {
			if (this.hasSameTactic(d))
				result.push(d);
		});
		return result;
	}

	onSelectStatus(status: string, respect: string, display: string): void {
		this._onSelectPhase = [status, respect];
		this.statusOption = display;
	}

	hasSameStatus(_: Rally, respect: string): boolean {
		if (!this._onSelectPhase || this._onSelectPhase[0] === '' || respect !== this._onSelectPhase[1]) 
			return false;
		let status = this.tacticService.extractGameStatus(_, respect);
		if (this._onSelectPhase[0] === 'phase1') 
			return this.tacticService.isPhase1(status);
		if (this._onSelectPhase[0] === 'phase2') 
			return this.tacticService.isPhase2(status);
		if (this._onSelectPhase[0] === 'phase3') 
			return this.tacticService.isPhase3(status);
		return false;
	}

	ngOnInit(): void {
		this.histogramA = new Histogram();
		this.histogramB = new Histogram();
		this.histogramA.range(
		{
			x0: 50, x1: 1350, y0: 50, y1: 250
		})
		.mode('bottom')
		.domain([0, 11]);
		this.histogramB.range(
		{
			x0: 50, x1: 1350, y0: 251, y1: 451
		})
		.mode('top')
		.domain([0, 11]);
		this.getData();
	}

}