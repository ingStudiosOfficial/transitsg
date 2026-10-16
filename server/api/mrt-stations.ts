import { getGtfsData } from '../utils/gtfs';
import { stationToLineShortName } from '../utils/station';

export default defineEventHandler(async () => {
	try {
		const data = await getGtfsData();
		const stops = data.stops;
		const stopsWithColor = stops.map((s) => {
			const lineShortName = stationToLineShortName(s.stop_code);
			const line = data.routes.find(
				(r) => r.route_short_name.toLowerCase() === lineShortName,
			);
			return {
				...s,
				color: `#${line?.route_color}`,
				text_color: `#${line?.route_text_color}`,
			};
		});
		return stopsWithColor;
	} catch (error) {
		console.error(error);
		return [];
	}
});
