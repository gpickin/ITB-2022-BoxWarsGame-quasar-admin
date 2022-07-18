<template>
	<div
		class="card text-white"
		:class="backgroundColor"
		style="border: 5px solid LightGray"
		:title="description"
	>
		<div class="card-content" @click="processClick" :class="divLinkClass">
			<div class="row">
				<div class="col-3">
					<q-icon
						:name="iconName"
						class="text-center q-pt-lg q-px-lg"
					/>
				</div>
				<div class="col-8">
					<p class="text-italic q-pt-md q-mb-xs text-h5">
						{{ title }}
					</p>
					<p ref="number" class="text-h4"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import CountUp from "countup.js";
	export default {
		props: [
			"title",
			"description",
			"total",
			"backgroundColor",
			"iconName",
			"link",
		],
		mounted() {
			this.countUp.start();
		},
		computed: {
			countUp() {
				return new CountUp(
					this.$refs.number,
					0,
					this.total,
					0,
					2.5,
					this.options
				);
			},
			divLinkClass() {
				if (this.link != null && this.link.length) {
					return "pointerCursor";
				} else {
					return "";
				}
			},
		},
		methods: {
			processClick() {
				if (this.link != null && this.link.length) {
					this.$router.push(this.link);
				}
			},
		},
		watch: {
			total() {
				this.countUp.start();
			},
		},
		data() {
			return {
				options: {
					separator: ",",
				},
			};
		},
	};
</script>
<style scoped>
	i {
		font-size: 54px;
	}

	.pointerCursor {
		cursor: pointer;
	}
</style>
