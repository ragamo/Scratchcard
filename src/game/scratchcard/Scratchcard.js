import PIXI from 'pixi.js';
import {particles} from 'pixi-particles';
import configParticles from './config/particles.json';

import Stage from '../../engine/Stage';
import Button from '../../engine/Button';
import InverseDrawingMask from './util/InverseDrawingMask';

/**
 * Main class
 */
export default class Scratchcard extends Stage {

	constructor(game) {
		super();
		this.game = game;

		//Generate a new inverse drawing mask
		this.drawingMask = new InverseDrawingMask(this);
	}

	/**
	 * Preload the assets
	 */
	preload() {
		return {
			background: 'assets/board.jpg',
			mask: 'assets/mask.jpg',
			winner: 'assets/winner.jpg',
			particle: 'assets/particle.png',
			buttonDefault: 'assets/buttonDefault.png',
			buttonHover: 'assets/buttonHover.png',
			buttonActive: 'assets/buttonActive.png'
		}
	}

	/**
	 * Run once for generate the UI
	 */
	render() {
		//Background
		let board = new PIXI.Sprite.fromImage(this.resources.background);
		this.addChild(board);

		//Mask sprite
		let mask = new PIXI.Sprite.fromImage(this.resources.mask);
		mask.position.set(387, 74);
		this.addChild(mask);

		//Get and assign the inversed mask
		mask.mask = this.drawingMask.getMaskSprite();

		//Check for game progress
		let isGameOver = () => {
			if(this.checkScratchedZones()) {
				this.gameOver(mask);
			}
		}
		this.on('mouseup', isGameOver);
		this.on('touchend', isGameOver);

		//Create some particles effect
		let particlesContainer = new PIXI.ParticleContainer();
		this.particles = new PIXI.particles.Emitter(particlesContainer, this.resources.particle, configParticles);
		this.particles.emit = false;
		this.addChild(particlesContainer);
		this.bindParticlesEvent(mask);
	}

	/**
	 * Determine if the scratching zones are already scratched
	 * @return {Boolean}
	 */
	checkScratchedZones() {
		//Check winning zones
		let zones = [	//Zones of 70x70 at position:
			{x: 670, y: 100},
			{x: 410, y: 330}, 
			{x: 670, y: 330}
		];

		let count = 0;
		for(var i in zones) {
			if(this.drawingMask.getFilledPercent(zones[i].x, zones[i].y, 70, 70) > 50)
				count++;
		}

		if(count == zones.length)
			return true;

		return false;
	}

	/**
	 * Display a game-over overlay
	 */
	gameOver(mask) {
		//Win container
		this.winContainer = new PIXI.Container();
		this.winContainer.alpha = 0;
		this.addChild(this.winContainer);

		//Win overlay
		let winOverlay = new PIXI.Sprite.fromImage(this.resources.winner);
		winOverlay.position.set(386, 73);
		this.winContainer.addChild(winOverlay);

		//Play again button
		let playAgainButton = new Button({
			defaultTexture: this.resources.buttonDefault,
			hoverTexture: this.resources.buttonHover,
			activeTexture: this.resources.buttonActive,
			text: 'Play again'
		});

		//Play again callback
		let newGame = () => {
			this.game.deleteStage(this.name);
			this.game.createStage(this.name, new Scratchcard(this.game));
			this.game.gotoAndPlay(this.name);
		}
		playAgainButton.on('click', newGame);
		playAgainButton.on('tap', newGame);

		//Add the button
		playAgainButton.position.set(510, 350);
		playAgainButton.width = 130;
		playAgainButton.height = 40;
		this.winContainer.addChild(playAgainButton);

		//Remove event listeners
		this.off('mousedown');
		this.off('mousemove');
		this.off('mouseup');
		this.off('touchstart');
		this.off('touchmove');
		this.off('touchend');

		mask.off('mousedown');
		mask.off('mousemove');
		mask.off('mouseup');
		mask.off('touchstart');
		mask.off('touchmove');
		mask.off('touchend');
	}

	/**
	 * Update on every frame
	 */
	update(elapsedTime) {
		if(this.drawingMask)
			this.drawingMask.update();

		if(this.particles)
			this.particles.update(elapsedTime);

		if(this.winContainer && this.winContainer.alpha < 1)
			this.winContainer.alpha += .05;
	}
	
	/**
	 * Binds events for start and stop the emitter
	 * also update the particles emitter position
	 * @param  {Sprite} mask The mask used for the scratching system (just for assign events)
	 */
	bindParticlesEvent(mask) {
		let onStart = () => {
			this.particles.emit = true;
		}
		let onMove = e => {
			let pos = e.data.getLocalPosition(this);
			this.particles.updateOwnerPos(pos.x, pos.y);
		};
		let onEnd = () => {
			this.particles.emit = false;
			this.particles.cleanup();
		}

		mask.interactive = true;
		mask.on('mousedown', onStart);
		mask.on('mousemove', onMove);
		mask.on('mouseup', onEnd);
		mask.on('touchstart', onStart);
		mask.on('touchmove', onMove);
		mask.on('touchend', onEnd);
	}

}