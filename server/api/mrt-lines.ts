import { getGtfsData } from '../utils/gtfs';

export default defineEventHandler(async () => {
	try {
		return (await getGtfsData()).routes;
	} catch (error) {
		console.error(error);
		return [];
	}
});
