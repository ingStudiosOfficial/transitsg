import type { GtfsData } from '~~/shared/types/GtfsData';
import type { GtfsRoute } from '~~/shared/types/GtfsRoute';
import type { GtfsStopColor } from '~~/shared/types/GtfsStopColor';

export async function getGtfsDataFromJson(path?: string): Promise<string | undefined> {
	if (!path) {
		const data = await useStorage('data').getItemRaw('gtfs-schedule-train.json');
		return data?.toString();
	} else {
		const data = await useStorage('data').getItemRaw(path);
		return data?.toString();
	}
}

export async function cacheJsonData(data: GtfsData) {
	console.log('Caching data as JSON.');

	const stopsWithColor = data.stops.map<GtfsStopColor>((s) => {
		const lineShortName = stationToLineShortName(s.stop_code);
		const line = data.routes.find((r) => r.route_short_name.toLowerCase() === lineShortName);
		return {
			...s,
			color: `#${line?.route_color}`,
			text_color: `#${line?.route_text_color}`,
			line: line,
		};
	});
	data.stops = stopsWithColor;

	await useStorage('data').setItem('gtfs-schedule-train.json', JSON.stringify(data));
	await useStorage('data').setItem('gtfs-stops.json', JSON.stringify(data.stops));
	await useStorage('data').setItem('gtfs-routes.json', JSON.stringify(data.routes));
}

export async function getGtfsData(): Promise<GtfsData> {
	const json = await getGtfsDataFromJson();
	if (!json) {
		const zipData = await useStorage('data').getItemRaw('gtfs-schedule-train.zip');

		const gtfsData = await unzipGtfsData(zipData);

		await cacheJsonData(gtfsData);

		return gtfsData;
	}

	return JSON.parse(json) as GtfsData;
}

export async function getGtfsStops(): Promise<GtfsStopColor[]> {
	const json = await getGtfsDataFromJson('gtfs-stops.json');
	if (!json) {
		const zipData = await useStorage('data').getItemRaw('gtfs-schedule-train.zip');

		const gtfsData = await unzipGtfsData(zipData);

		await cacheJsonData(gtfsData);

		return await getGtfsStops();
	}

	return JSON.parse(json) as GtfsStopColor[];
}

export async function getGtfsRoutes(): Promise<GtfsRoute[]> {
	const json = await getGtfsDataFromJson('gtfs-routes.json');
	if (!json) {
		const zipData = await useStorage('data').getItemRaw('gtfs-schedule-train.zip');

		const gtfsData = await unzipGtfsData(zipData);

		await cacheJsonData(gtfsData);

		return await getGtfsRoutes();
	}

	return JSON.parse(json) as GtfsRoute[];
}
