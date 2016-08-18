import PIXI from 'pixi.js';
import EventEmitter from 'eventemitter3';

/**
 * A interface for PIXI.loader.Loader object
 */
export default class Preloader extends EventEmitter {

	constructor(resources) {
		super();

		//Creates a new Loader
		let loader = new PIXI.loaders.Loader();

		//Append the resources
		for(var i in resources) {
			loader.add(resources[i]);
		}

		//Check the events
		loader.on('complete', () => {
			this.emit('complete');
		});

		loader.on('error', () => {
			this.emit('error');
		});

		loader.on('progress', (loader, resource) => {
			this.emit('progress', Math.ceil(loader.progress));		
			//console.log('Loading: '+loader.progress+'% '+resource.name);
		});

		//Start the loader
		loader.load();
	}

}