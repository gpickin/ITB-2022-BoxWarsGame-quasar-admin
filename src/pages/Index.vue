<template>
	<div></div>
</template>

<style></style>

<script>
	export default {
		name: "IndexPageRedirector",
		beforeMount() {
			this.$router.push({ path: `dashboard` });
		},
	};
</script>
