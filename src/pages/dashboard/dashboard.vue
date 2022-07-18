<template>
	<q-page class="">
		<div class="row">
			<div class="col-12 q-pa-lg">
				<div class="row" v-for="group in cardGroups" :key="group.title">
					<div class="col-12">
						<h4 class="q-ma-xs q-mb-md">{{ group.title }}</h4>
					</div>
					<div
						class="col-md-6 col-lg-4 col-lg-4 q-pa-lg"
						v-for="card in group.cards"
						:key="group.title + card.title"
					>
						<cardTotal
							:title="card.title"
							:description="card.description"
							:background-color="card.backgroundColor"
							:icon-name="card.iconName"
							:total="card.total"
							:link="card.link"
						>
						</cardTotal>
					</div>
				</div>
			</div>
		</div>
	</q-page>
</template>

<style></style>

<script>
	import { axiosInstance } from "boot/axios";
	import cardTotal from "./cardTotal.vue";

	export default {
		name: "dashboard",
		data() {
			return {
				cardGroups: [],
			};
		},
		components: {
			cardTotal,
		},
		computed: {},
		mounted() {
			this.getDashboardCards();
		},
		methods: {
			getDashboardCards: function () {
				this.$q.loading.show({});
				axiosInstance
					.get("dashboards")
					.then((response) => {
						if (!response.data.error) {
							this.cardGroups = response.data.data;
							this.$q.loading.hide();
						} else {
							this.$q.loading.hide();
						}
					})
					.catch((error) => {
						console.log(error);
						this.$q.loading.hide();
					});
			},
		},
	};
</script>
