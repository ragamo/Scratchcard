import Engine from '../engine/Engine';
import Intro from './intro/Intro';
import Scratchcard from './scratchcard/Scratchcard';

export default class Game extends Engine {

	constructor(config) {
		super(config);

		this.createStage('scratchcard', new Scratchcard(this));
		this.createStage('intro', new Intro(this));
		this.gotoAndPlay('intro');
	}

}