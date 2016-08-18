import PIXI, {Container} from 'pixi.js';

/**
 * Stage
 * 
 * Abstract class for PIXI.Container
 * Unfortunately ES6 doesn't support interfaces :(
 */
export default class Stage extends Container {
	
	/**
	 * Preload
	 * 
	 * Executed before the stage has loaded,
	 * this method push the resources to the Preloader class
	 * and then asign them to use as this.resources
	 * 
	 * @return {Object} Associative object key:value
	 */
	preload() {
		return {}
	}

	/**
	 * Render
	 * 
	 * Executed once, after all resources has loaded
	 * Any new object must declarate here (or in constructor)
	 */
	render() {}
	
	/**
	 * Update
	 * 
	 * Executed on every frame
	 * @param  {Number} elapsedTime Elapsed time since the last drawed frame
	 */
	update(elapsedTime) {}

}