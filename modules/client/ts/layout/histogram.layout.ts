import { Injectable } from '@angular/core';

import { Rect } from '../util/svg.interface';

interface Config {
	binWidth?: number,
	binHeight?: number,
	binSegment?: number,
	x0: number,
	x1: number,
	y0: number,
	y1: number,
	mode: string,
	domain: number[]
}

interface ValueCallBack {
	(_: any): number
}

export class Histogram {

	private config: Config = {
		binSegment: 2,
		x0: 0,
		x1: 0,
		y0: 0,
		y1: 0,
		mode: 'bottom',
		domain: [0, 0]
	};

	private data: any[];

	constructor() {}

	range(config: any): Histogram {
		let keys = [
			'binSegment',
			'x0',
			'x1',
			'y0',
			'y1'
		];
		keys.forEach((d) => {
			if (config[d] !== undefined) 
				this.config[d] = config[d];
		});
		return this;
	}

	domain(config: number[]): Histogram {
		if (config.length === 2) 
			this.config.domain = config;
		return this;
	}

	mode(_: string): Histogram {
		if (_) this.config.mode = _;
		return this;
	}

	dataset(data: any[]): Histogram {
		this.data = data;
		return this;
	}

	histogrm(cb: ValueCallBack): Rect[] {
		let result: Rect[] = [];
		try {
			this.config.binWidth = Math.round(
				(Math.abs(this.config.x0 - this.config.x1) 
					- (this.data.length-1)*this.config.binSegment) / this.data.length
				);
			this.config.binHeight = Math.abs(this.config.y1 - this.config.y0);
		} catch(err) {
			return null;
		}
		let tmpx = this.config.x0;
		this.data.forEach((d, i) => {
			let value: number = cb(d); 
			let rect: Rect = {
				x: 0, y: 0, width: 0, height: 0
			};
			rect.width = this.config.binWidth;
			rect.height = (value-this.config.domain[0]) / 
				(this.config.domain[1] - this.config.domain[0]) * this.config.binHeight;
			rect.x = tmpx;
			if (this.config.mode === 'top')
				rect.y = this.config.y0;
			else if(this.config.mode === 'bottom')
				rect.y = this.config.y1 - rect.height;
			result.push(rect);
			tmpx += rect.width + this.config.binSegment;
		});
		return result;
	}
}