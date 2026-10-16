export async function getGtfsDataFromJson(): Promise<string | undefined> {
	const data = await useStorage('assets:server').getItem('gtfs-schedule-train.json');
	return data?.toString();
}

export async function cacheJsonData(data: string) {
	console.log('Caching data as JSON.');
	await useStorage('data').setItem('gtfs-schedule-train.json', data);
}

export async function getGtfsData(): Promise<GtfsData> {
	const json = await getGtfsDataFromJson();
	if (!json) {
		const zipData = await useStorage('data').getItemRaw('gtfs-schedule-train.zip');

		const gtfsData = await unzipGtfsData(zipData);

		await cacheJsonData(JSON.stringify(gtfsData));

		return gtfsData;
	}

	return JSON.parse(json) as GtfsData;
}
