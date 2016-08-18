import PIXI from 'pixi.js';
import Stage from './Stage';
import Preloader from './Preloader';
import Profiler from './Profiler';

/**
 * Engine
 * 
 * This class provides the main loop of the game,
 * also acts as a Stage (scene) manager and
 * as a Loader manager
 */
export default class Engine {

	constructor(config){
		//Create main renderer
		this.renderer = new PIXI.autoDetectRenderer(config.width || 800, config.height || 600, config.options);
		document.body.appendChild(this.renderer.view);
		
		//Stage manager properties
		this.stages = {};
		this.currentStage = null;

		//Preloader manager properties
		this.resources = {};

		//Create a profiler for debug
		this.debug = config.profiler;
		if(this.debug) 
			this.profiler = new Profiler();

		// Calculate the current time
		this.elapsedTime = Date.now();

		//Start the loop
		this.loop();
	}

	/**
	 * Main game loop
	 */
	loop(time) {
		//Start the profiler
		if(this.debug && this.profiler) 
			this.profiler.begin();

		//Request a new frame to browser
		window.requestAnimationFrame(time => this.loop(time));

		let now = Date.now();

		//Render current stage
		if(this.currentStage) {
			if(this.currentStage.update)
				//Pass elapsed seconds and time to the update method
				this.currentStage.update((now - this.elapsedTime) * 0.001, time);

			this.renderer.render(this.currentStage)
		}

		this.elapsedTime = now;

		//End the profiler
		if(this.debug && this.profiler) 
			this.profiler.end();
	}

	/**
	 * Push a new stage to the stack.
	 * 	
	 * @param  {String} name  Stage's name
	 * @param  {Stage}  stage Stage object
	 * @return {Stage}
	 */
	createStage(name, stage = new Stage()) {
		if(name in this.stages)
			throw new Error('Stage "'+name+'" already exists');

	
		//If the stage has a preloader method, register his resources
		//to push them to the Preloader class
		if(stage.preload) {
			let stageResources = stage.preload();
			for(var i in stageResources) {
				this.resources[i] = stageResources[i];
			}

			//Assing the resources for use inside the class
			stage.resources = stageResources;
		}

		//Register the stage
		stage.name = name;
		this.stages[name] = stage;

		//Assign the first stage created
		if(!this.currentStage)
			this.currentStage = this.stages[name];

		return this.stages[name];
	}

	/**
	 * Delete a stage from the stage's stack
	 * 
	 * @param  {String} stage Stage's name
	 * @return {Boolean}
	 */
	deleteStage(stage) {
		if(stage in this.stages) {
			delete this.stages[stage];
			return true;
		}
		return false;
	}

	/**
	 * Change the current stage
	 * 
	 * @param  {String} name Stage's name
	 */
	gotoAndPlay(name) {
		if(!(name in this.stages))
			throw new Error('Unable to find stage: "'+name+'"');

		this.currentStage = this.stages[name];
		if(this.currentStage.render)
			this.currentStage.render();
	}
}