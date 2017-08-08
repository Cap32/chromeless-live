
import yargs from 'yargs';
import { Chromeless } from 'chromeless';
import termImg from 'term-img';
import { h, render, Component } from 'ink';
import { launch as chromeLaunch } from 'chrome-launcher';

const { argv } = yargs
	.demand(1, 'Please specify URL')
	.options({
		width: {
			desc: 'width',
			alias: 'w',
			type: 'number',
			default: 320,
		},
		height: {
			desc: 'height',
			alias: 'h',
			type: 'number',
			default: 480,
		},
	})
;

const {
	_: [url],
	width = 320,
	height = 480,
} = argv;

async function run() {

	await chromeLaunch({
		chromeFlags: [
			'--disable-gpu',
			'--headless',
		],
		port: 9222,
	});

	const chromeless = new Chromeless({
		launchChrome: false,
		viewport: { width, height },
	});

	chromeless.goto(url);

	const stop = async () => {
		try { await chromeless.end(); }
		catch (err) {}
	};


	class App extends Component {
		state = {
			data: '',
		};

		async componentDidMount() {

			const loop = async () => {
				try {
					const screenshotFile = await chromeless.screenshot();
					this.setState({
						data: termImg.string(screenshotFile, {
							width: `${width}px`,
							height: `${height}px`,
							preserveAspectRatio: false,
						}),
					});
				}
				catch (err) {}

				setTimeout(loop, 1000 / 60);
			};
			loop();
		}

		render() {
			const { data } = this.state;
			return (
				<div>{data}</div>
			);
		}
	}

	render(<App />);

	process.on('SIGINT', stop);
	process.on('SIGTERM', stop);
}

run().catch(console.error);
