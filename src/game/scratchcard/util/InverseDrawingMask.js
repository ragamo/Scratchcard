import PIXI from 'pixi.js';

/**
 * InverseDrawinMask
 * Creates a new drawing canvas to be used as mask
 */
export default class InverseDrawingMask  {
	
	constructor(stage) {
		this.isDrawing = false;

		this.stage = stage;
		this.stage.interactive = true;

		//Get stage dimensions
		this.width = this.stage.game.renderer.width;
		this.height = this.stage.game.renderer.height;

		//Create a new canvas
		this.renderer = new PIXI.CanvasRenderer(this.width, this.height, { backgroundColor: 0xFFFFFF });
		//document.body.appendChild(this.renderer.view);

		this.innerStage = new PIXI.Container();

		//Create a drawing point for the cursor coordinates
		this.drawingPoint = new PIXI.Graphics();
		this.innerStage.addChild(this.drawingPoint);

		//Assign events
		this.stage.on('mousedown', this.onStart.bind(this));
		this.stage.on('mousemove', this.onMove.bind(this));
		this.stage.on('mouseup', this.onEnd.bind(this));
		this.stage.on('touchstart', this.onStart.bind(this));
		this.stage.on('touchmove', this.onMove.bind(this));
		this.stage.on('touchend', this.onEnd.bind(this));

		//Register the canvas as texture, it needs to update on every frame
		this.texture = new PIXI.Texture.fromCanvas(this.renderer.view);
	}

	/**
	 * Events handlers
	 */
	onStart() {
		this.isDrawing = true;
	}

	onEnd() {
		this.isDrawing = false;
	}

	onMove(e) {
		if(this.isDrawing) {
			let pos = e.data.getLocalPosition(this.stage);
			this.drawingPoint.beginFill(0x000000);
			this.drawingPoint.drawCircle(pos.x, pos.y, 15);				
			this.drawingPoint.endFill();
		}
	}

	/**
	 * update
	 * Updates the canvas renderer and the "canvas texture"
	 */
	update() {
		this.renderer.render(this.innerStage);
		this.texture.update();
	}

	/**
	 * getMaskSprite
	 * @return {Sprite} A new sprite to be used as mask
	 */
	getMaskSprite() {
		return new PIXI.Sprite(this.texture);
	}

	/**
	 * getFilledPercent
	 * Calculates how many black pixels were drawn
	 * in certain portion of the canvas
	 * 
	 * @param  {Number} x      Postion X
	 * @param  {Number} y      Position Y
	 * @param  {Number} width  Width
	 * @param  {Number} height Height
	 * @return {Number}        Percent of black pixels
	 */
	getFilledPercent(x, y, width, height) {
		let data = this.renderer.context.getImageData(x, y, width, height).data;
		let count = 0;
		for(var i=0, len=data.length; i<len; i+=4) 
			if(data[i]<255) 
				count++;

		return (100 * count / (width*height)).toFixed(2);
	}

}