<template>
	<q-layout view="lHh Lpr lFf">
		<q-header>
			<q-toolbar>
				<q-toolbar-title>
					Dev Feud - Admin
					<q-chip
						size="sm"
						round
						color=""
						v-if="!(getEnvironment === 'prod')"
						>{{ getEnvironment }}</q-chip
					>
				</q-toolbar-title>

				<q-btn
					@click="rightDrawerOpen = !rightDrawerOpen"
					flat
					round
					dense
					icon="menu"
				/>
			</q-toolbar>
		</q-header>
		<q-drawer
			v-model="rightDrawerOpen"
			:content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
			side="right"
		>
			<q-list :content-class="'bg-grey-1'">
				<q-item clickable @click.native="$router.push('/dashboard')">
					<q-item-section avatar>
						<q-icon name="fas fa-tachometer-alt" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Dashboard</q-item-label>
					</q-item-section>
				</q-item>
				<q-item clickable @click.native="$router.push('/questions')">
					<q-item-section avatar>
						<q-icon name="fas fa-laptop-code" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Manage Questions</q-item-label>
					</q-item-section>
				</q-item>
				<q-item clickable @click="logout()">
					<q-item-section avatar>
						<q-icon name="fas fa-sign-out-alt" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Logout</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>
		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
	export default {
		name: "MainLayout",
		data() {
			return {
				rightDrawerOpen: true,
			};
		},
		computed: {
			getEnvironment() {
				return process.env.environment;
			},
			isLoggedIn() {
				return this.$store.getters["appstate/isLoggedIn"];
			},
		},
		methods: {
			logout() {
				this.$store.commit("appstate/logoutUser", "");
				this.$router.push("/");
			},
		},
	};
</script>

<style>
	.q-expansion-item-sub-item {
		padding: 0px;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #b2b2b2;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #ffffff;
		background-color: #eaeaea;
	}

	.checkbox {
		max-width: 40px;
		padding-left: 35px;
	}
</style>
