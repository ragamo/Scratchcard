import PIXI, {Sprite} from 'pixi.js';

/**
 * A interface for create interactive buttons
 * with default, hover and active states
 */
export default class Button extends Sprite {

	constructor(params) {
		super();

		this.interactive = true;
		this.disabled = false;

		//If defaultTexture is preset
		if('defaultTexture' in params) {
			this.texture = this.defaultTexture = new PIXI.Texture.fromImage(params.defaultTexture);
		}

		//If hoverTexture is preset
		if('hoverTexture' in params) {
			this.hoverTexture = new PIXI.Texture.fromImage(params.hoverTexture);

			this.on('mouseover', () => {
				if(!this.disabled)
					this.texture = this.hoverTexture
			});

			this.on('mouseout', () => {
				this.texture = this.defaultTexture;
			});
		}

		//If activeTexture is preset
		if('activeTexture' in params) {
			this.activeTexture = new PIXI.Texture.fromImage(params.activeTexture);

			this.on('mousedown', () => {
				if(!this.disabled)
					this.texture = this.activeTexture
			});
		}
	
		//If text is preset
		if('text' in params) {
			let label = new PIXI.Text(params.text);
			label.position.x = (this.width/2)-(label.width/2);
			label.position.y = (this.height/2)-(label.height/2);
			this.addChild(label);
		}
	}

}