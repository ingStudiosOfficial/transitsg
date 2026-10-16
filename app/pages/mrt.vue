<script setup lang="ts">
definePageMeta({
	title: 'MRT',
	name: 'mrt',
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

const { data: stations } = await useFetch('/api/mrt-stations');
console.log('Stations:', stations.value);

const uniqueStations = computed(() => {
	return stations.value?.filter((s) => s.parent_station === '');
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
</script>

<template>
	<div class="bg">
		<div class="pg">
			<m3e-heading class="heading" variant="headline" size="large">MRT</m3e-heading>
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
