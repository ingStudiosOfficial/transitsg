import unzipper from 'unzipper';
import type { GftsFetchResponse } from './types/GftsFetchResponse';
import type { GtfsDataRaw } from './types/GtfsDataRaw';
import csv from 'csvtojson';
import type { GtfsAgency } from './types/GtfsAgency';
import type { GtfsRoute } from './types/GtfsRoute';
import type { GtfsStop } from './types/GtfsStop';
import type { GtfsStopTime } from './types/GtfsStopTime';
import type { GtfsData } from './types/GtfsData';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import JSZip from 'jszip';

export async function cacheGtfsData() {
	const url = await fetchGtfsUrl();
	const gtfsData = await fetchGtfsZip(url);
	const gtfsObject = await createGtfsObject(gtfsData);
	await cacheGtfsFile(gtfsObject);
}

async function fetchGtfsUrl(): Promise<string> {
	const apiKey = process.env.NUXT_DATAMALL_API_KEY;
	if (!apiKey || apiKey.length === 0) {
		console.error('error: LTA DataMall API key missing.');
		process.exit(1);
	}

	const response = await fetch(
		'https://datamall2.mytransport.sg/ltaodataservice/GTFSScheduleTrain',
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				AccountKey: apiKey || '',
			},
		},
	);

	const data: GftsFetchResponse = await response.json();

	const link = data.value[0].link;
	console.log('log: link:', link);

	return link;
}

async function fetchGtfsZip(url: string): Promise<GtfsDataRaw> {
	const response = await fetch(url, {
		method: 'GET',
	});

	const directory = await unzipper.Open.buffer(Buffer.from(await response.arrayBuffer()));

	const agency = directory.files.find((f) => f.path === 'agency.txt');
	const agencyContent = (await agency!.buffer()).toString();

	const routes = directory.files.find((f) => f.path === 'routes.txt');
	const routesContent = (await routes!.buffer()).toString();

	const stops = directory.files.find((f) => f.path === 'stops.txt');
	const stopsContent = (await stops!.buffer()).toString();

	const stopTimes = directory.files.find((f) => f.path === 'stop_times.txt');
	const stopTimesContent = (await stopTimes!.buffer()).toString();

	return {
		agency: agencyContent,
		routes: routesContent,
		stops: stopsContent,
		stopTimes: stopTimesContent,
	};
}

async function parseAgency(agencyRaw: string): Promise<GtfsAgency[]> {
	const jsonData = await csv().fromString(agencyRaw);
	console.log('log: agency json:', jsonData);
	return jsonData;
}

async function parseRoutes(routesRaw: string): Promise<GtfsRoute[]> {
	const jsonData = await csv().fromString(routesRaw);
	console.log('log: routes json:', jsonData);
	return jsonData;
}

async function parseStops(stopsRaw: string): Promise<GtfsStop[]> {
	const jsonData = await csv().fromString(stopsRaw);
	console.log('log: stops json:', jsonData);
	return jsonData;
}

async function parseStopTime(stopTimesRaw: string): Promise<GtfsStopTime[]> {
	const jsonData = await csv().fromString(stopTimesRaw);
	console.log('log: stops times json:', jsonData);
	return jsonData;
}

async function createGtfsObject(gtfsData: GtfsDataRaw): Promise<GtfsData> {
	const agency = await parseAgency(gtfsData.agency);
	const routes = await parseRoutes(gtfsData.routes);
	const stops = await parseStops(gtfsData.stops);
	const stopTimes = await parseStopTime(gtfsData.stopTimes);
	return {
		agency,
		routes,
		stops,
		stopTimes,
	};
}

async function cacheGtfsFile(gtfsData: GtfsData) {
	const zip = zipGtfsJson(gtfsData);
	const content = await zip.generateAsync({
		type: 'nodebuffer',
	});
	const outputPath = path.join(process.cwd(), 'data/gtfs-schedule-train.zip');
	const dir = path.dirname(outputPath);
	if (!fsSync.existsSync(dir)) {
		await fs.mkdir(dir, {
			recursive: true,
		});
	}
	await fs.writeFile(outputPath, content);
	console.info(`info: successfully cached gtfs zip of ${content.byteLength / 1048576} mb`);
}

function zipGtfsJson(gtfsData: GtfsData): JSZip {
	const zip = new JSZip();
	zip.file('gtfs-data.json', JSON.stringify(gtfsData), {
		compression: 'DEFLATE',
		compressionOptions: { level: 9 },
	});
	console.log('log: successfully zipped json file');
	return zip;
}

cacheGtfsData();
