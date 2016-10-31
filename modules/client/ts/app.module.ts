import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';

import { RequestService } from './service/request.service';
import { TacticService } from './service/tactic.service';
import { AppComponent } from './component/app.component';
import { HistogramComponent } from './component/histogram.component';
import { TacticDetailComponent } from './component/tactic-detail.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		JsonpModule
	],
	declarations: [
		AppComponent,
		HistogramComponent,
		TacticDetailComponent
	],
	providers: [ RequestService, TacticService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {

}