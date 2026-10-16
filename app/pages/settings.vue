<script setup lang="ts">
definePageMeta({
	title: 'Settings',
	name: 'settings',
});

useSeoMeta({
	title: 'Settings',
	description:
		'Update settings on transitsg, a free and open-source web app made by (ing) Studios.',
	ogTitle: 'MRT | transitsg',
	ogUrl: 'https://transitsg.ingstudios.dev/settings',
	ogDescription:
		'Update settings on transitsg, a free and open-source web app made by (ing) Studios.',
	ogImage: 'https://transitsg.ingstudios.dev/og.png',
	ogImageWidth: 1200,
	ogImageHeight: 630,
	ogSiteName: 'transitsg - all your Singapore transit needs in one app',
});

const { $pwa } = useNuxtApp();
</script>

<template>
	<div class="bg">
		<div class="pg">
			<m3e-heading class="heading" variant="headline" size="large">Settings</m3e-heading>
			<m3e-callout v-if="!$pwa?.isPWAInstalled && $pwa?.showInstallPrompt">
				<Icon slot="icon" name="material-symbols:install-desktop-outline" />
				<span slot="label">Install app</span>
				<span>Install transitsg as an app to quickly access it from your home screen</span>
				<div class="content">
					<m3e-button variant="text" @click="$pwa.install()">Install</m3e-button>
				</div>
			</m3e-callout>
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

.heading {
	color: var(--md-sys-color-on-surface);
}

m3e-callout {
	.content {
		display: flex;
		flex-direction: column;
		align-items: end;
	}
}
</style>
