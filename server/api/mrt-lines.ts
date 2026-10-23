import { getGtfsRoutes } from '../utils/gtfs';

export default defineEventHandler(async () => {
	try {
		return await getGtfsRoutes();
	} catch (error) {
		console.error(error);
		return [];
	}
});
