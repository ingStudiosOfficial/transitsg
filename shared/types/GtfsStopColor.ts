import type { GtfsRoute } from './GtfsRoute';
import type { GtfsStop } from './GtfsStop';

export interface GtfsStopColor extends GtfsStop {
	color: string;
	text_color: string;
	line?: GtfsRoute;
}
