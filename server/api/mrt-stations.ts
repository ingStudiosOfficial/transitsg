import { getGtfsStops } from '../utils/gtfs';

export default defineEventHandler(async () => {
	try {
		const stops = await getGtfsStops();
		return stops;
	} catch (error) {
		console.error(error);
		return [];
	}
});
