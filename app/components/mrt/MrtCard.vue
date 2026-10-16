<script setup lang="ts">
const props = defineProps<{
	station: GtfsStopColor;
}>();

const stationColor = computed(() => {
	return props.station.color;
});

const textColor = computed(() => {
	return props.station.text_color;
});
</script>

<template>
	<m3e-card>
		<div slot="header" class="header">
			<div class="station-code">{{ props.station.stop_code }}</div>
			<m3e-heading variant="title" size="large">{{ props.station.stop_name }}</m3e-heading>
		</div>
		<div slot="content" class="content">
			<span>{{ props.station.stop_name }}</span> station ({{ props.station.stop_code }})
		</div>
	</m3e-card>
</template>

<style scoped lang="css">
.header {
	background-color: v-bind(stationColor);
	color: v-bind(textColor);
	border-radius: 8px;
	box-sizing: border-box;
	padding: 16px;
	display: flex;
	flex-direction: row;
	gap: 16px;
	align-items: center;
	font-family: 'lta-identity';
}

.station-code {
	font-family: 'lta-identity';
	border: 2px solid v-bind(textColor);
	padding: 4px;
	box-sizing: border-box;
	border-radius: 64px;
}

.content {
	margin-top: 8px;
}
</style>
