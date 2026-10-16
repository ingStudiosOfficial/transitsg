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
			<m3e-list variant="segmented">
				<m3e-list-item>
					<m3e-avatar
						slot="leading"
						:style="{
							'--m3e-avatar-color': stationColor,
						}"
					>
						<span
							:style="{
								color: textColor,
								fontFamily: 'lta-identity',
							}"
							>{{ props.station.line?.route_short_name }}</span
						>
					</m3e-avatar>
					<span>{{ props.station.line?.route_long_name }}</span>
				</m3e-list-item>
			</m3e-list>
		</div>
	</m3e-card>
</template>

<style lang="css" scoped>
.header {
	background-color: v-bind(stationColor);
	color: v-bind(textColor);
	border-radius: 16px;
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
	background-color: v-bind(stationColor);
	color: v-bind(textColor);
	border: 2px solid v-bind(textColor);
	padding: 4px 8px;
	box-sizing: border-box;
	border-radius: 64px;
}

.content {
	margin-top: 8px;
}
</style>
