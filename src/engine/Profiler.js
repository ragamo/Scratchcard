import Stats from 'stats.js';

/**
 * A small profiler for show the FPS and memory usage
 */
export default class Profiler {

	constructor() {
		this.stats = new Stats();
		this.stats.showPanel(0);
		document.body.appendChild(this.stats.dom);
	}

	begin() {
		this.stats.begin();
	}

	end() {
		this.stats.end();
	}

}