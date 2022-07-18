<template>
	<div>
		<div class="col-12 text-center">
			<!-- <img
					src="~/assets/CaliforniaSafetyTrainingCompany_Logo.png"
					alt="CSTC California Safety Training Logo"
					title="CSTC California Safety Training Logo"
				/> -->
			<div class="text-h4">Dev Feud Admin</div>
		</div>
		<div class="col-6 text-center offset-3 q-pa-md">
			<q-input
				v-model="username"
				label="Email"
				:error="usernameHasError"
				error-message="We need a valid Email"
				v-on:keyup.enter="login()"
				:bottom-slots="true"
			/>
			<q-input
				v-model="password"
				label="Password"
				:error="passwordHasError"
				error-message="Please enter a password"
				type="password"
				v-on:keyup.enter="login()"
				:bottom-slots="true"
			/>
		</div>

		<div class="col-4 text-center offset-4 q-pa-md">
			<q-btn
				color="primary"
				class="bg-blue-10"
				size="md"
				label="Login"
				icon="people"
				@click.native="login()"
			/>
		</div>
	</div>
</template>

<style></style>

<script>
	// import { axiosInstance } from "boot/axios";
	import { axiosLoginInstance } from "boot/axios";

	export default {
		name: "LoginPage",
		data() {
			return {
				username: "",
				password: "",
				api: process.env.API,
			};
		},
		methods: {
			login: function (selected) {
				axiosLoginInstance
					.post("/login", {
						email: this.username,
						password: this.password,
					})
					.then((response) => {
						console.log(response);
						if (!response.data.error) {
							var defaultRoute = "/dashboard";
							this.$store.commit("appstate/loginUser", {
								email: this.username,
								jwt: response.data.data,
							});
							this.$router.push({
								path: this.$route.query.goto
									? this.$route.query.goto
									: defaultRoute,
							});
						} else {
							this.password = "";
							this.$q.notify({
								color: "negative",
								textColor: "white",
								icon: "people",
								message: `Invalid Credentials`,
							});
						}
					})
					.catch((error) => {
						if (error.response.status == 401) {
							this.$q.notify({
								color: "negative",
								textColor: "white",
								icon: "people",
								message: `${error.response.statusText}`,
							});
						} else {
							this.$q.notify({
								color: "negative",
								textColor: "white",
								icon: "people",
								message: `${error}`,
							});
						}
					});
			},
		},
		computed: {
			usernameHasError() {
				if (this.username == 0) {
					return true;
				} else {
					return false;
				}
			},
			passwordHasError() {
				if (this.password == 0) {
					return true;
				} else {
					return false;
				}
			},
		},
	};
</script>
