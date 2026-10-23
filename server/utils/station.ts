export function stationToLineShortName(stationId: string): string {
	const id = stationId.toLowerCase();
	console.log('ID:', id);

	if (id.startsWith('ns')) {
		return 'ns';
	} else if (id.startsWith('ew')) {
		return 'ew';
	} else if (id.startsWith('cg')) {
		return 'ew';
	} else if (id.startsWith('ne')) {
		return 'ne';
	} else if (id.startsWith('cc')) {
		return 'cc';
	} else if (id.startsWith('ce')) {
		return 'cc';
	} else if (id.startsWith('dt')) {
		return 'dt';
	} else if (id.startsWith('te')) {
		return 'te';
	} else if (id.startsWith('bp')) {
		return 'bp';
	} else if (id.startsWith('se')) {
		return 'sk';
	} else if (id.startsWith('sw')) {
		return 'sk';
	} else if (id.startsWith('st')) {
		return 'sk';
	} else if (id.startsWith('pe')) {
		return 'pg';
	} else if (id.startsWith('pw')) {
		return 'pg';
	} else if (id.startsWith('pt')) {
		return 'pg';
	} else {
		return id;
	}
}
