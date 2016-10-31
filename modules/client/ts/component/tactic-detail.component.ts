import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { Strike, Rally, Tactic } from '../util/strike';
import { Circle, Line, Path } from '../util/svg.interface';
import { RequestService } from '../service/request.service';
import { TacticService } from '../service/tactic.service';

interface TacticLayout {
	balls: Circle[],
	lines: Path[],
	lineTypes: string[],
	x0: number,
	y0: number
}

@Component({
	selector: 'tactic-detail',
	templateUrl: '../modules/client/templates/tactic-detail.component.html' ,
	styleUrls: [ '../modules/client/styles/tactic-detail.component.css' ]
})
export class TacticDetailComponent implements OnInit, OnChanges {

	@Input()
	tactics: Tactic[] = [];

	rectNo: any[] = [];

	config: any = {
		x0: 50,
		y0: 10,
		segment: 25,
		areaWidth: 50,
		areaHeight: 30,
		r: 8
	};

	// tactics: Tactic[] = [
	// 	{ 
	// 		startStrike: 0,
	// 		ballPositions: [ 1, 12, 6 ],
	// 		strikeTechs: [ 1, 1, 1 ]
	// 	},
	// 	{ 
	// 		startStrike: 0,
	// 		ballPositions: [ 3, 15, 0 ],
	// 		strikeTechs: [ 1, 1, 1 ]
	// 	}
	// ];

	tacticLayouts: TacticLayout[] = [];

	constructor(private tacticService: TacticService) {}

	layout(): void {
		console.log(this.tactics);
		this.tacticLayouts = [];
		this.tactics.forEach((d, index) => {
			let balls: Circle[] = [];
			let lines: Path[] = [];
			let lineTypes: string[] = [];
			d.ballPositions.forEach((p, i) => {
				p = this.tacticService.Ball2Table(p+'');
				let area = this.rectNo[p];
				let cx = area.x + (area.width / 2) + this.config.x0;
				let cy = area.y + (area.height / 2) + this.config.y0 
				+ index*(this.config.segment+area.height*6);
				let r = this.config.r;
				balls.push({
					cx: cx, cy: cy, r: r
				});
			});
			//1-3拍
			if (d.startStrike === 0) {
				//反手长球
				let p = d.ballPositions[0] % 2 === 1 ? '21' : '22';
				let areaNo = this.tacticService.Ball2Table(p);
				let area = this.rectNo[areaNo];
				let cx = area.x + (area.width / 2) + this.config.x0;
				let cy = area.y + (area.height / 2) + this.config.y0 
				+ index*(this.config.segment+area.height*6);
				let r = this.config.r;
				balls.splice(1,0,{
					cx: cx, cy: cy, r: r
				});
			}
			//2-4拍
			else if (d.startStrike === 1) {
				//反手长球
				let p = d.ballPositions[0] % 2 === 1 ? '22' : '21';
				let areaNo = this.tacticService.Ball2Table(p);
				let area = this.rectNo[areaNo];
				let cx = area.x + (area.width / 2) + this.config.x0;
				let cy = area.y + (area.height / 2) + this.config.y0 
				+ index*(this.config.segment+area.height*6);
				let r = this.config.r;
				balls.splice(0,0,{
					cx: cx, cy: cy, r: r
				});
			}
			//连线
			for(let i = 1; i < balls.length; i++) {
				lines.push({
					d: this.pathTo(balls[i-1].cx, balls[i-1].cy,
						balls[i].cx, balls[i].cy)
				});
				if (d.ballPositions[i-1] < 3) 
					lineTypes.push('serve');
				else if (d.ballPositions[i-1] < 11)
					lineTypes.push('offense');
				else if (d.ballPositions[i-1] < 15)
					lineTypes.push('control');
				else if (d.ballPositions[i-1] < 25)
					lineTypes.push('defense');
				else 
					lineTypes.push('score');
			}
			this.tacticLayouts.push({
				balls: balls,
				lines: lines,
				lineTypes: lineTypes,
				x0: this.config.x0,
				y0: this.config.y0 + index*(this.config.segment
					+this.config.areaHeight*6)
			});
		});
	}

	pathTo(x1:number, y1:number, x2:number, y2:number): string {
		let d: string = '';
		let controlx: number = (x1+x2)/2,
				controly: number = (y1+y2)/2;
		if (y1 < y2) {
			controlx -= 20; 
		}
		else {
			controlx += 20;
		}
		let qx = [x1, controlx, x2];
		let qy = [y1, controly, y2];
		for (let i = 0; i <= 1; i += 0.02) {
			let x = this.spline(qx, i, 3);
			let y = this.spline(qy, i, 3);
			d += i === 0 ? 'M ' : 'L ';
			d += x + ' ' + y + ' ';
		}
		return d;
	}

	spline(q: number[], id: number, k: number): number {
    var n = q.length - 1;
    var t = genT(k, n);
    var r = 0;
    for(var i = 0; i <=n; i++){
        //console.log(N(i,k,id,t));
        r += (q[i]*N(i,k,id,t));
    }
    //console.log("----------");
    return r;
		function N(i: number, k: number, id: number, t: number[]): number{
		    if(k == 1){
		        if(id <=t[i+1] && id >=t[i]){
		            return 1;
		        }
		        else{
		            return 0;
		        }
		    }
		    else{
		        var a = (id - t[i])*N(i,k-1,id,t);
		        var b = (t[i+k-1]-t[i]);
		        var c = (t[i+k] - id)*N(i+1,k-1,id,t);
		        var d = (t[i+k]-t[i+1]);
		        if(b == 0){
		            b = 1;
		        }
		        if(d == 0){
		            d = 1;
		        }
		        return (a/b) + (c/d);
		    }
		}
		function genT(k: number, n: number): number[]{
		    var t: number[] = [];
		    for(var i = 0; i <=n+k; i++){
		        if(i < k){
		            t.push(0);
		        }
		        else if(i >=k && i <=n){
		            t.push(i-k+1);
		        }
		        else{
		            t.push(n-k+2);
		        }
		    }
		    var len = t[t.length-1] - t[0];
		    if(len != 0){
		        for(var i = 0; i < t.length; i++){
		            t[i] /= len;
		        }
		    }
		    return t;
		}
	}

	ngOnInit(): void {
		let areaWidth = this.config.areaWidth;
		let areaHeight = this.config.areaHeight;
		for(let i = 0; i < 18; i++){
			let area: any = {};
			area.x = (i % 3) * areaWidth;
			area.y = Math.floor(i/3) * areaHeight;
			area.width = areaWidth;
			area.height = areaHeight;
			this.rectNo.push(area);
		}
		// this.layout();
	}

  ngOnChanges(changes: any) {
  	console.log(changes);
    this.layout();
  }

}