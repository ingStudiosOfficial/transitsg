import { getGtfsData } from '../utils/gtfs';
import { stationToLineShortName } from '../utils/station';
import type { GtfsStopColor } from '~~/shared/types/GtfsStopColor';

export default defineEventHandler(async () => {
	try {
		const data = await getGtfsData();
		const stops = data.stops;
		const stopsWithColor = stops.map<GtfsStopColor>((s) => {
			const lineShortName = stationToLineShortName(s.stop_code);
			const line = data.routes.find(
				(r) => r.route_short_name.toLowerCase() === lineShortName,
			);
			return {
				...s,
				color: `#${line?.route_color}`,
				text_color: `#${line?.route_text_color}`,
				line: line,
			};
		});
		return stopsWithColor;
	} catch (error) {
		console.error(error);
		return [];
	}
});
