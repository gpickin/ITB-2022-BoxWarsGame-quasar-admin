<template>
	<q-page class="">
		<div class="q-pa-md q-ma-auto">
			<h4 class="q-ma-xs q-mb-md">Question</h4>

			<div class="q-pa-md text-h4" v-if="!editQuestion">
				<q-btn
					icon="edit"
					flat
					color="white"
					class="bg-blue"
					@click="editQuestion = true"
				/>
				{{ question.question }}
				<q-btn
					color="red"
					glossy
					size="md"
					icon-right="fa-solid fa-trash"
					label="Delete"
					@click="deleteQuestion()"
					class="float-right"
				/>
			</div>
			<div class="q-pa-md text-h4" v-if="editQuestion">
				<q-input
					large
					outlined
					label="Question"
					v-model="newValue"
					class="bg-white text-h5"
					v-if="editQuestion"
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
						/>
						<q-btn
							size="small"
							icon="cancel"
							flat
							color="white"
							label="Cancel"
							class="bg-red"
							@click="cancelQuestion()"
						/>
					</template>
				</q-input>
			</div>

			<q-btn
				color="blue"
				glossy
				size="md"
				icon="add"
				label="Add Answer"
				v-if="!answerForm"
				@click="answerForm = true"
			/>
			<div>
				<q-banner
					inline-actions
					v-if="answerForm"
					class="q-ma-sm text-white bg-blue row"
				>
					<p class="text-h5">New Answer</p>
					<div class="row q-py-sm">
						<div class="col-9 q-px-sm">
							<q-input
								label="Answer"
								stack-label
								outlined
								v-model="newAnswer.newAnswer"
								class="bg-white text-h5"
								:error="$v.newAnswer.newAnswer.$invalid"
								error-message="Please enter a Valid Answer"
								:bottom-slots="true"
							/>
						</div>
						<div class="col-3 q-px-sm">
							<q-input
								label="Starting Vote Count"
								stack-label
								outlined
								v-model="newAnswer.bulkVotes"
								class="bg-white text-h5"
								mask="###"
								:error="$v.newAnswer.bulkVotes.$invalid"
								error-message="Bulk votes must be between 0 and 999"
								:bottom-slots="true"
							>
							</q-input>
						</div>
					</div>
					<div>
						<q-btn
							size="small"
							icon="save"
							flat
							color="white"
							label="Save"
							class="bg-green"
							@click="saveNewAnswer()"
						/>
						<q-btn
							size="small"
							icon="cancel"
							flat
							color="white"
							label="Cancel"
							class="bg-red"
							@click="cancelNewAnswer()"
						/>
					</div>
				</q-banner>
				<q-banner
					inline-actions
					v-for="answer in question.answers"
					v-bind:key="answer.answerID"
					class="q-ma-sm text-white bg-blue"
				>
					<q-input
						outlined
						v-model="answer.newValue"
						class="bg-white text-h5"
						v-if="answer.editing"
					>
						<template v-slot:append>
							<q-btn
								size="small"
								icon="save"
								flat
								color="white"
								label="Save"
								class="bg-green"
								@click="saveAnswer(answer)"
							/>
							<q-btn
								size="small"
								icon="cancel"
								flat
								color="white"
								label="Cancel"
								class="bg-red"
								@click="cancelAnswer(answer)"
							/>
						</template>
					</q-input>

					<span class="text-h5" v-if="!answer.editing">
						<q-badge align="middle"
							>{{ answer.votesCount }} Votes</q-badge
						>
						{{ answer.answer }}
					</span>

					<template v-slot:action>
						<q-btn
							size="small"
							icon="edit"
							flat
							color="blue"
							label="Edit"
							class="bg-white"
							@click="answer.editing = true"
							v-if="!answer.editing"
						/>
						<q-btn
							color="red"
							glossy
							size="small"
							icon-right="fa-solid fa-trash"
							label="Delete"
							@click="deleteAnswer(answer)"
							class="float-right"
							v-if="!answer.editing"
						/>
					</template>
				</q-banner>
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
							@click.native="$router.push({ path: `/questions` })"
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
	import {
		required,
		minLength,
		email,
		maxLength,
		numeric,
		minValue,
		maxValue,
	} from "vuelidate/lib/validators";

	export default {
		name: "showQuestion",
		data() {
			return {
				newValue: "",
				editQuestion: false,
				question: {
					questionID: "",
					question: "",
					answers: [],
				},
				answerForm: true,
				newAnswer: {
					newAnswer: "",
					bulkVotes: 0,
				},
			};
		},
		validations: {
			newValue: {
				required,
				minLength: minLength(1),
				maxLength: maxLength(255),
			},
			newAnswer: {
				newAnswer: {
					required,
					minLength: minLength(1),
					maxLength: maxLength(255),
				},
				bulkVotes: {
					required,
					numeric,
					minLength: minLength(1),
					maxLength: maxLength(3),
					minValue: minValue(0),
					maxValue: maxValue(999),
				},
			},
		},
		computed: {},
		mounted() {
			this.apiRequest();
		},
		methods: {
			saveNewAnswer() {
				if (this.$v.newAnswer.$invalid) {
					this.$q.notify({
						color: "negative",
						textColor: "white",
						icon: "person",
						position: "center",
						message: `Answer is not Valid`,
						timeout: 5000,
					});
				} else {
					axiosInstance
						.post(`questions/${this.question.questionID}/answers`, {
							answer: this.newAnswer.newAnswer,
							bulkVotes: this.newAnswer.bulkVotes,
						})
						.then(({ data }) => {
							if (!data.error) {
								this.$q.notify({
									color: "positive",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: "Answer saved",
									timeout: 5000,
								});
								this.cancelNewAnswer();
								this.answerForm = true;
								this.apiRequest();
							} else {
								this.$q.notify({
									color: "negative",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: `Error Saving Answer - ${data.messages[0]}`,
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
								message: `Error Saving Answer - ${error.message}`,
								timeout: 0,
								actions: [{ label: "Dismiss", color: "white" }],
							});
						});
				}
			},
			cancelNewAnswer() {
				this.newAnswer.newAnswer = "";
				this.answerForm = false;
				this.newAnswer.bulkVotes = 0;
			},
			saveAnswer(answer) {
				axiosInstance
					.put(
						`questions/${this.question.questionID}/answers/${answer.answerID}`,
						{
							answer: answer.newValue,
						}
					)
					.then(({ data }) => {
						if (!data.error) {
							this.$q.notify({
								color: "positive",
								textColor: "white",
								icon: "people",
								position: "bottom-right",
								message: "Answer saved",
								timeout: 5000,
							});
							answer.answer = answer.newValue;
							answer.editing = false;
							this.apiRequest();
						} else {
							this.$q.notify({
								color: "negative",
								textColor: "white",
								icon: "people",
								position: "bottom-right",
								message: `Error Saving Answer - ${data.messages[0]}`,
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
							message: `Error Saving Answer - ${error.message}`,
							timeout: 0,
							actions: [{ label: "Dismiss", color: "white" }],
						});
					});
			},
			cancelAnswer(answer) {
				answer.newValue = answer.answer;
				answer.editing = false;
			},
			deleteQuestion() {
				this.$q
					.dialog({
						title: "Confirm",
						message: "Are you sure you want to remove this Question?",
						ok: "Confirm",
						cancel: "Cancel",
					})
					.onOk(() => {
						this.$store
							.dispatch("questions/deleteQuestion", {
								questionID: this.question.questionID,
							})
							.then(() => {
								this.$q.notify({
									color: "positive",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: `Question Removed`,
								});
								this.$router.push({ path: `/questions` });
							})
							.catch((error) => {
								this.$q.notify({
									color: "negative",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: error,
									timeout: 0,
									actions: [{ label: "Dismiss", color: "white" }],
								});
							});
					})
					.onCancel(() => {});
			},
			deleteAnswer(answer) {
				this.$q
					.dialog({
						title: "Confirm",
						message:
							"Are you sure you want to remove this Answer and all the Votes?",
						ok: "Confirm",
						cancel: "Cancel",
					})
					.onOk(() => {
						axiosInstance
							.delete(
								`questions/${this.question.questionID}/answers/${answer.answerID}`
							)
							.then(() => {
								this.$q.notify({
									color: "positive",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: `Answer Removed`,
								});
								this.apiRequest();
							})
							.catch((error) => {
								this.$q.notify({
									color: "negative",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: error,
									timeout: 0,
									actions: [{ label: "Dismiss", color: "white" }],
								});
							});
					})
					.onCancel(() => {});
			},
			saveQuestion() {
				if (this.$v.newValue.$invalid) {
					this.$q.notify({
						color: "negative",
						textColor: "white",
						icon: "person",
						position: "center",
						message: `Please fix Question validation before saving`,
						timeout: 0,
						actions: [{ label: "Dismiss", color: "white" }],
					});
				} else {
					axiosInstance
						.put(`questions/${this.$route.params.questionID}`, {
							question: this.newValue,
						})
						.then(({ data }) => {
							if (!data.error) {
								this.question.question = this.newValue;
								this.cancelQuestion();
							} else {
								this.$q.notify({
									color: "negative",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: "Error Saving Question",
									timeout: 0,
									actions: [{ label: "Dismiss", color: "white" }],
								});
								// this.$router.push({ path: `/questions` });
							}
						})
						.catch((error) => {
							this.$q.notify({
								color: "negative",
								textColor: "white",
								icon: "people",
								position: "bottom-right",
								message: "Error Saving Question",
								timeout: 0,
								actions: [{ label: "Dismiss", color: "white" }],
							});
							// this.$router.push({ path: `/questions` });
						});
				}
			},
			cancelQuestion() {
				this.newValue = this.question.question;
				this.editQuestion = false;
			},
			apiRequest() {
				axiosInstance
					.get(
						`questions/${this.$route.params.questionID}?includeAnswers=1`
					)
					.then(({ data }) => {
						if (!data.error) {
							data.data.answers.map(function (answer) {
								answer.editing = false;
								answer.newValue = answer.answer;
								return answer;
							});
							this.newValue = data.data.question;
							this.question = data.data;
						} else {
							this.$q.notify({
								color: "negative",
								textColor: "white",
								icon: "people",
								position: "bottom-right",
								message: "Error loading Question",
								timeout: 0,
								actions: [{ label: "Dismiss", color: "white" }],
							});
							this.$router.push({ path: `/questions` });
						}
					})
					.catch((error) => {
						this.$q.notify({
							color: "negative",
							textColor: "white",
							icon: "people",
							position: "bottom-right",
							message: error.message,
							timeout: 0,
							actions: [{ label: "Dismiss", color: "white" }],
						});
						this.$router.push({ path: `/questions` });
					});
			},
		},
	};
</script>
