import Stage from '../../engine/Stage';
import Preloader from '../../engine/Preloader';

/**
 * This Stage acts as view for the Preloader module
 */
export default class Intro extends Stage {

	constructor(game) {
		super();
		this.game = game;

		//Start the preloader
		this.preloader = new Preloader(this.game.resources);

		//Loading... text
		let loadingText = new PIXI.Text('Loading...', {
			font: '36px Arial',
			fill: '#F7EDCA'
		});

		loadingText.position.x = this.game.renderer.width/2 - loadingText.width/2;
		loadingText.position.y = this.game.renderer.height/2 - loadingText.height/2;
		this.addChild(loadingText);
		
		//Percent loaded text
		this.percentText = new PIXI.Text('0%', {
			font: '18px Arial',
			fill: '#F7EDCA'
		});
		this.percentText.position.y = this.game.renderer.height/2 - this.percentText.height/2 + 40;
		this.addChild(this.percentText);
	}

	update() {
		//Mantain the percentText centered
		this.percentText.position.x = this.game.renderer.width/2 - this.percentText.width/2;

		//Listen of events
		this.preloader.on('progress', percent => {
			this.percentText.text = percent+'%';
		});

		//Everything done, go to menu
		this.preloader.on('complete', () => {
			this.game.gotoAndPlay('scratchcard');
		});
	}

}