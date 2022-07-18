<template>
	<q-page class="">
		<div class="q-pa-md q-ma-auto">
			<h4 class="q-ma-xs q-mb-md">New Question</h4>

			<div class="q-pa-md text-h4">
				<q-input
					type="textarea"
					outlined
					autogrow
					label="Question"
					v-model="newValue"
					class="bg-white text-h5"
					:error="$v.newValue.$invalid"
					error-message="Please enter a Valid Question"
					:bottom-slots="true"
				>
					<template v-slot:append>
						<q-btn
							size="small"
							icon="save"
							flat
							color="white"
							label="Save"
							class="bg-green"
							@click="saveQuestion()"
							v-if="!$v.newValue.$invalid"
						/>
					</template>
				</q-input>
			</div>

			<q-footer>
				<q-toolbar class="flex flex-center text-black q-pa-sm">
					<q-btn-group push>
						<q-btn
							color="white"
							class="text-blue"
							glossy
							size="md"
							icon="reply"
							label="Questions"
							@click="$router.push({ path: `/questions` })"
						/>
					</q-btn-group>
				</q-toolbar>
			</q-footer>
		</div>
	</q-page>
</template>

<style></style>

<script>
	import { axiosInstance } from "boot/axios";
	import { required, minLength, maxLength } from "vuelidate/lib/validators";

	export default {
		name: "newQuestion",
		data() {
			return {
				newValue: "",
			};
		},
		validations: {
			newValue: {
				required,
				minLength: minLength(1),
				maxLength: maxLength(255),
			},
		},
		computed: {},
		mounted() {},
		methods: {
			saveQuestion() {
				axiosInstance
					.post(`questions`, {
						question: this.newValue,
					})
					.then(({ data }) => {
						if (!data.error) {
							this.$q.notify({
								color: "positive",
								textColor: "white",
								icon: "people",
								position: "bottom-right",
								message: "Question saved",
								timeout: 5000,
							});
							this.$router.push({
								path: `/questions/${data.data.questionID}/show`,
							});
						} else {
							this.$q.notify({
								color: "negative",
								textColor: "white",
								icon: "people",
								position: "bottom-right",
								message: `Error Saving Question - ${data.messages[0]}`,
								timeout: 0,
								actions: [{ label: "Dismiss", color: "white" }],
							});
						}
					})
					.catch((error) => {
						this.$q.notify({
							color: "negative",
							textColor: "white",
							icon: "people",
							position: "bottom-right",
							message: `Error Saving Question - ${error.message}`,
							timeout: 0,
							actions: [{ label: "Dismiss", color: "white" }],
						});
					});
			},
		},
	};
</script>
