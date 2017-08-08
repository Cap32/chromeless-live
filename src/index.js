
import yargs from 'yargs';
import { Chromeless } from 'chromeless';
import termImg from 'term-img';
import logUpdate from 'log-update';

const { argv } = yargs.demand(1, 'Please specify URL');
const url = argv._[0];

async function run() {

	const chromeless = new Chromeless({
		launchChrome: false,
	});

	chromeless
		.setViewport({ width: 320, height: 240, scale: 1 })
		.goto(url)
		// .goto('http://www.html5videoplayer.net/videos/madagascar3.mp4')
	;

	const liveDisplay = async () => {
		try {
			const screenshotFile = await chromeless.screenshot();
			logUpdate(termImg.string(screenshotFile));
		}
		catch (err) {}

		setTimeout(liveDisplay, 10);
	};

	liveDisplay();

	const stop = async () => {
		try { await chromeless.end(); }
		catch (err) {}
	};

	process.on('SIGINT', stop);
	process.on('SIGTERM', stop);
}

run().catch(console.error);
