<template>
	<q-page class="">
		<div class="row">
			<div class="col-12 q-pa-md">
				<h4 class="q-ma-xs q-mb-md">Manage Questions</h4>
				<!-- <p>Questions</p> -->

				<q-table
					:data="serverDataQuestions"
					:columns="columns"
					:filter="filters"
					row-key="int_class_id"
					:pagination.sync="serverPaginationQuestions"
					:loading="loadingQuestions"
					@request="apiRequestQuestions"
					color="primary"
				>
					<template slot="top">
						<div class="col-12">
							<q-input
								hide-underline
								color="secondary"
								v-model="filters.question"
								class="col-12"
								placeholder=""
								label="Question Filter"
								stack-label
								debounce="500"
								not-clearable
								@clear="
									() => {
										this.filters.question = '';
									}
								"
							>
								<template v-slot:prepend>
									<q-icon name="search" />
								</template>
							</q-input>
						</div>
					</template>

					<q-tr slot="header" slot-scope="props">
						<q-th
							v-for="col in props.cols"
							:key="col.name"
							:props="props"
						>
							{{ col.label }}
						</q-th>
						<q-th class="text-right">Actions</q-th>
					</q-tr>
					<template slot="body" slot-scope="props">
						<q-tr :props="props">
							<q-td
								key="questionID"
								:props="props"
								auto-width
								class="cursor-pointer"
								@click.native="rowClick(props.row)"
							>
								{{ props.row.questionID }}
							</q-td>
							<q-td
								key="question"
								:props="props"
								class="cursor-pointer"
								@click.native="rowClick(props.row)"
								>{{ props.row.question }}</q-td
							>
							<q-td
								key="answersCount"
								:props="props"
								class="cursor-pointer"
								@click.native="rowClick(props.row)"
								>{{ props.row.answersCount }}</q-td
							>

							<q-td class="text-right">
								<q-btn
									color="negative"
									round
									icon="delete"
									title="Remove Question"
									@click.native="
										removeQuestion(props.row.questionID)
									"
								/>
							</q-td>
						</q-tr>
					</template>
				</q-table>
			</div>
		</div>
		<q-footer>
			<q-toolbar class="flex flex-center text-black q-pa-sm">
				<q-btn-group push>
					<!-- <q-btn
						color="green"
						glossy
						size="md"
						icon="fas fa-arrow-left"
						label="Divisions"
						@click="$router.push({ path: `/divisions/` })"
					/> -->
					<q-btn
						color="white"
						class="text-blue"
						glossy
						size="md"
						icon-right="add"
						label="Add Question"
						@click="$router.push({ path: `/questions/new` })"
					/>
				</q-btn-group>
			</q-toolbar>
		</q-footer>
	</q-page>
</template>

<style></style>

<script>
	import { axiosInstance } from "boot/axios";

	export default {
		name: "Questions",
		data() {
			return {
				selected: [],
				columns: [
					{
						name: "questionID",
						required: true,
						align: "center",
						label: "QuestionID",
						field: "questionID",
						sortable: true,
					},
					{
						name: "question",
						required: true,
						label: "Question",
						align: "left",
						field: "question",
						sortable: true,
					},
					{
						name: "answersCount",
						required: true,
						label: "Answer Count",
						align: "left",
						field: "answersCount",
						sortable: true,
					},
					// {
					// 	name: "txt_user_lname",
					// 	required: true,
					// 	label: "Last Name",
					// 	align: "left",
					// 	field: "txt_user_lname",
					// 	sortable: true,
					// },
					// {
					// 	name: "txt_user_email",
					// 	required: true,
					// 	label: "Email Address",
					// 	field: "txt_user_email",
					// 	sortable: true,
					// },
					// {
					// 	name: "txt_dob_mm",
					// 	required: true,
					// 	label: "DOB MM",
					// 	field: "txt_dob_mm",
					// 	sortable: true,
					// },
					// {
					// 	name: "txt_dob_dd",
					// 	required: true,
					// 	label: "DOB DD",
					// 	field: "txt_dob_dd",
					// 	sortable: true,
					// },
					// {
					// 	name: "txt_company_id",
					// 	required: true,
					// 	label: "Employee ID",
					// 	field: "txt_company_id",
					// 	sortable: true,
					// },
				],
				filter: "",
				visibleColumns: [
					"questionID",
					"question",
					// "txt_user_lname",
					// "txt_user_email",
					// "txt_dob_mm",
					// "txt_dob_dd",
					// "txt_company_id",
				],
				separator: "horizontal",

				loadingQuestions: false,
				serverDataQuestions: [],
				serverPaginationQuestions: {
					page: 1,
					rowsNumber: 10, // specifying this determines pagination is server-side
					rowsPerPage: 25,
					sortBy: "questionID",
					descending: true,
				},
				filters: {
					question: "",
				},
			};
		},
		computed: {},
		created() {},
		mounted() {
			this.reloadTable();
		},
		methods: {
			reloadTable() {
				this.apiRequestQuestions({
					pagination: this.serverPaginationQuestions,
					filter: this.filters,
				});
			},
			apiRequestQuestions({ pagination, filter }) {
				// we set QTable to "loading" state
				this.loadingQuestions = true;

				// we do the server data fetch, based on pagination and filter received
				// (using Axios here, but can be anything; parameters vary based on backend implementation)
				axiosInstance
					.get(
						`questions?page=${pagination.page}&maxrows=${pagination.rowsPerPage}&sortBy=${pagination.sortBy}&descending=${pagination.descending}&question=${filter.question}`
					)
					.then(({ data }) => {
						// updating pagination to reflect in the UI
						this.serverPaginationQuestions = pagination;

						// we also set (or update) rowsNumber
						this.serverPaginationQuestions.rowsNumber =
							data.pagination.totalRecords;

						// then we update the rows with the fetched ones
						this.serverDataQuestions = data.data.map((item) => {
							return item;
						});

						// finally we tell QTable to exit the "loading" state
						this.loadingQuestions = false;
					})
					.catch((error) => {
						// there's an error... do SOMETHING
						console.log(error);
						alert("Error Fetching Questions via API");
						// we tell QTable to exit the "loading" state
						this.loadingQuestions = false;
					});
			},
			removeQuestion(questionID) {
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
								questionID: questionID,
							})
							.then(() => {
								this.$q.notify({
									color: "positive",
									textColor: "white",
									icon: "people",
									position: "bottom-right",
									message: `Question Removed`,
								});
								this.$q.loading.hide();
								this.reloadTable();
								//$router.push({ path: `/questions` });
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
								this.$q.loading.hide();
							});
					})
					.onCancel(() => {});
			},
			rowClick(row) {
				this.$router.push({ path: `/questions/${row.questionID}/show` });
			},
		},
	};
</script>
