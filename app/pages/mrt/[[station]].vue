<script setup lang="ts">
import { vibrate } from '~/plugins/vibrate.client';

definePageMeta({
	title: 'MRT',
	name: 'mrt',
	alias: ['/mrt'],
});

useSeoMeta({
	title: 'MRT',
	description:
		'Use MRT tools on transitsg, a free and open-source web app made by (ing) Studios.',
	ogTitle: 'MRT | transitsg',
	ogUrl: 'https://transitsg.ingstudios.dev/mrt',
	ogDescription:
		'Use MRT tools on transitsg, a free and open-source web app made by (ing) Studios.',
	ogImage: 'https://transitsg.ingstudios.dev/og_mrt.png',
	ogImageWidth: 1200,
	ogImageHeight: 630,
	ogSiteName: 'transitsg - all your Singapore transit needs in one app',
});

const { style, zoom, center, circleColor, outlineColor } = useBus();

const route = useRoute();

const router = useRouter();

const { data: stations } = await useFetch('/api/mrt-stations');
console.log('Stations:', stations.value);

const uniqueStations = computed(() => {
	return stations.value?.filter((s) => s.parent_station === '');
});

const station = computed(() => {
	return uniqueStations.value?.find(
		(s) => s.stop_code.toLowerCase() === (route.params.station as string).toLowerCase(),
	);
});

const geojson = computed(() => {
	return {
		type: 'FeatureCollection',
		features: uniqueStations.value?.map((s) => {
			const lon = parseFloat(s.stop_lon);
			const lat = parseFloat(s.stop_lat);

			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [lon, lat],
				},
				properties: {
					id: s.stop_id,
					bgColor: s.color || circleColor.value,
					textColor: s.text_color || outlineColor.value,
					code: s.stop_code,
				},
			};
		}),
	};
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleStationClick(e: any) {
	vibrate();

	console.log(e);

	const feature = e.features[0];
	if (!feature) {
		console.error('No feature found.');
		return;
	}

	const properties: {
		id: string;
		bgColor: string;
		textColor: string;
		code: string;
	} = feature.properties;

	router.push({
		name: 'mrt',
		params: {
			station: properties.code,
		},
	});
}
</script>

<template>
	<div class="bg">
		<div class="pg">
			<m3e-heading class="heading" variant="headline" size="large">MRT</m3e-heading>
			<MrtCard v-if="station" :station="station" />
			<ClientOnly>
				<MglMap :map-style="style" :zoom="zoom" :center="center">
					<MglGeoJsonSource source-id="mrt-stations" :data="toRaw(geojson)">
						<MglCircleLayer
							source="mrt-stations"
							layer-id="stations"
							:paint="{
								'circle-color': ['get', 'bgColor'],
								'circle-stroke-color': ['get', 'textColor'],
								'circle-radius': 16,
							}"
							@click="handleStationClick"
						/>
						<MglSymbolLayer
							layer-id="mrt-codes"
							:layout="{
								'text-field': ['get', 'code'],
								'text-size': 8,
							}"
							:paint="{
								'text-color': ['get', 'textColor'],
							}"
						/>
					</MglGeoJsonSource>

					<MglNavigationControl />
				</MglMap>
			</ClientOnly>
		</div>
	</div>
</template>

<style lang="css" scoped>
.bg {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background-color: var(--md-sys-color-surface-container);
}

.pg {
	width: 100%;
	height: 100%;
	min-height: 0;
	overflow-y: auto;
	background-color: var(--md-sys-color-surface);
	border-radius: 32px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	padding: 16px;
	gap: 16px;
}

.pg::-webkit-scrollbar {
	display: none;
}

.heading {
	color: var(--md-sys-color-on-surface);
}
</style>

<style lang="css">
.maplibregl-map {
	border-radius: 16px;
	min-height: 50svh;
	box-sizing: border-box;
}
</style>
