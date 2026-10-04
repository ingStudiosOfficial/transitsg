<script setup lang="ts">
import PinnedBusCard from '~/components/bus/PinnedBusCard.vue';
import { getPinnedBusStops } from '~/db/bus-db';
import type { TrafficIncident } from '~~/shared/types/TrafficIncident';
import type { TrainServiceMessage } from '~~/shared/types/TrainServiceMessage';

definePageMeta({
	title: 'Home',
	name: 'home',
});

useSeoMeta({
	title: 'Home',
	description:
		'Check alerts, bus timings, and MRT tools with the transitsg, a free and open-source web app made by (ing) Studios.',
	ogTitle: 'Home | transitsg',
	ogUrl: 'https://transitsg.ingstudios.dev',
	ogDescription:
		'Check alerts, bus timings. and MRT tools with the transitsg, a free and open-source web app made by (ing) Studios.',
	ogImage: 'https://transitsg.ingstudios.dev/og.png',
	ogImageWidth: 1200,
	ogImageHeight: 630,
	ogSiteName: 'transitsg - all your Singapore transit needs in one app',
});

const router = useRouter();

const { data: trainServiceMessages } = await useFetch<TrainServiceMessage[]>(
	'/api/train-service-alerts',
);

const { data: trafficIncidents } = await useFetch<TrafficIncident[]>('/api/traffic-incidents');

const pinnedBusStops = ref<BusStop[]>([]);

function goToRoute(name: string) {
	router.push({
		name: name,
	});
}

onMounted(async () => {
	pinnedBusStops.value = await getPinnedBusStops();
});
</script>

<template>
	<div class="bg">
		<div class="pg">
			<template
				v-if="
					pinnedBusStops.length === 0 &&
					trainServiceMessages?.length === 0 &&
					trafficIncidents?.length === 0
				"
			>
				<m3e-heading variant="display" size="small">transitsg</m3e-heading>
				<span
					>Pinned bus stops, service alerts, and traffic incidents will appear here</span
				>
				<div class="no-content">
					<m3e-card actionable @click="goToRoute('bus-stop')">
						<div slot="header" class="header">
							<m3e-avatar>
								<Icon name="material-symbols:bus-map-pin-outline" />
							</m3e-avatar>
							<m3e-heading variant="title" size="large">Bus stops</m3e-heading>
						</div>
						<span slot="content" class="content">View bus stops and bus timings</span>
					</m3e-card>
					<m3e-card actionable @click="goToRoute('bus-service')">
						<div slot="header" class="header">
							<m3e-avatar>
								<Icon name="material-symbols:directions-bus-outline" />
							</m3e-avatar>
							<m3e-heading variant="title" size="large">Bus services</m3e-heading>
						</div>
						<span slot="content" class="content">View bus services and bus routes</span>
					</m3e-card>
					<m3e-card actionable @click="goToRoute('mrt')">
						<div slot="header" class="header">
							<m3e-avatar>
								<Icon name="material-symbols:train-outline" />
							</m3e-avatar>
							<m3e-heading variant="title" size="large">MRT</m3e-heading>
						</div>
						<span slot="content" class="content">View MRT stations and schedules</span>
					</m3e-card>
				</div>
			</template>

			<m3e-heading
				v-if="pinnedBusStops.length !== 0"
				class="heading"
				variant="headline"
				size="large"
				>Pinned Bus Stops</m3e-heading
			>
			<div v-if="pinnedBusStops && pinnedBusStops.length !== 0" class="pinned-stops">
				<PinnedBusCard
					v-for="stop in pinnedBusStops"
					:key="stop.code"
					v-vibrate
					:stop="stop"
				/>
			</div>

			<m3e-heading
				v-if="trainServiceMessages?.length !== 0"
				class="heading"
				variant="headline"
				size="large"
				>Service Alerts</m3e-heading
			>
			<m3e-card v-if="trainServiceMessages?.length !== 0">
				<m3e-list slot="content" variant="segmented">
					<m3e-list-item v-for="alert in trainServiceMessages" :key="alert.Content">
						<m3e-avatar slot="leading">
							<Icon :name="getAlertIcon(alert.Content)" />
						</m3e-avatar>
						<span slot="overline">{{ alert.CreatedDate }}</span>
						{{ alert.Content }}
					</m3e-list-item>
				</m3e-list>
			</m3e-card>

			<m3e-heading
				v-if="trafficIncidents?.length !== 0"
				class="heading"
				variant="headline"
				size="large"
				>Traffic Incidents</m3e-heading
			>
			<m3e-card v-if="trafficIncidents?.length !== 0">
				<m3e-list slot="content" variant="segmented">
					<m3e-list-item v-for="incident in trafficIncidents" :key="incident.Message">
						<m3e-avatar slot="leading">
							<Icon :name="getTrafficIcon(incident.Type)" />
						</m3e-avatar>
						<span slot="overline">{{ incident.Type }}</span>
						{{ incident.Message }}
					</m3e-list-item>
				</m3e-list>
			</m3e-card>
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
	overflow-y: scroll;
	background-color: var(--md-sys-color-surface);
	border-radius: 32px;
	padding: 16px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.pg::-webkit-scrollbar {
	display: none;
}

.heading {
	color: var(--md-sys-color-on-surface);
}

.pinned-stops {
	display: grid;
	gap: 16px;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	grid-template-rows: auto;
	width: 100%;
}

.no-content {
	display: grid;
	gap: 16px;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	grid-template-rows: auto;
	width: 100%;

	.header {
		display: flex;
		flex-direction: row;
		gap: 16px;
	}

	.content {
		box-sizing: border-box;
		margin-top: 8px;
	}
}
</style>
