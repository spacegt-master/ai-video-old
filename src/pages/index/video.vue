<template>
	<v-container class="pa-6 pa-md-12" max-width="1600px" fluid>
		<v-responsive max-width="800">
			<p class="font-weight-bold text-h4  ">
				我的微课
			</p>
		</v-responsive>

		<v-row class="mt-4">
			<v-col v-for="(item, i) in items" :key="i" cols="12" md="3" sm="6">
				<v-hover v-slot="{ isHovering, props: hoverProps }">
					<a :href="item.uri" class="glightbox">
						<v-card class="mx-auto" flat link :ripple="false" rounded="lg" v-bind="hoverProps">
							<v-img :aspect-ratio="3 / 2" block cover :src="item.cover"
								lazy-src="https://picsum.photos/id/11/300/200">
								<template v-slot:placeholder>
									<div class="d-flex align-center justify-center fill-height">
										<v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
									</div>
								</template>
							</v-img>

							<v-overlay class="align-center justify-center" contained :model-value="isHovering"
								persistent>
								<v-btn icon="mdi-play"> </v-btn>
							</v-overlay>
						</v-card>
					</a>
				</v-hover>

				<div class="font-weight-bold text-body-1 mt-3 d-flex justify-space-between align-center">
					{{ item.name }}

					<div>
						<v-btn class="ml-2" icon="mdi-download-circle-outline" variant="plain" size="small"
							density="comfortable" @click.stop="handleDownload(item.uri)"></v-btn>

						<v-btn icon="mdi-delete-circle-outline" variant="plain" size="small" density="comfortable"
							@click.stop="onDelete(item.id)"></v-btn>
					</div>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import GLightbox from 'glightbox';
import { ref, onMounted } from 'vue'
import { VideoApi } from '@/api/video'

const items = ref([])

const handleDownload = async (uri) => {
	window.open(uri)
}

const onDelete = async (id) => {
	await VideoApi.del(id)
	loadVideos()
}

const loadVideos = async () => {
	items.value = await VideoApi.list()
}

onMounted(() => {
	loadVideos()
	setTimeout(() => GLightbox(
		{
			plyr: {
				css: '/plyr/plyr.css',
				js: '/plyr/plyr.js'
			}
		}
	), 300)
})
</script>
<style></style>