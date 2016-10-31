import { Component, OnInit, ViewChild } from '@angular/core';

import { Strike, Rally, Tactic } from '../util/strike';
import { HistogramComponent } from './histogram.component';
import { TacticDetailComponent } from './tactic-detail.component';
import { TacticService } from '../service/tactic.service';

@Component({
	selector: 'my-app',
	templateUrl: '../modules/client/templates/app.component.html',
	styleUrls: [ '../modules/client/styles/app.component.css' ] 
})
export class AppComponent {

	@ViewChild(HistogramComponent)
	private histogramComponent: HistogramComponent;

	@ViewChild(TacticDetailComponent)
	private tacticDetailComponent: TacticDetailComponent;

	rallies: Rally[] = [];

	tactics: Tactic[] = [];

	constructor(private tacticService: TacticService) {}

	rallySelected(rallies: Rally[]) {
		console.log(rallies);
		this.rallies = rallies;
		let tactics: Tactic[]  = [];
		this.rallies.forEach((d) => {
			let tactic = this.tacticService.extractTacticDetail(d);
			if (tactic[0]) tactics.push(tactic[0]);
			if (tactic[1]) tactics.push(tactic[1]);
		});
		this.tactics = tactics;
	}
}