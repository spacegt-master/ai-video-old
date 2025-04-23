<template>
	<v-container height="240px">
		<section>
			<h3 class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold">
				选择音频

				<v-btn class="pe-2" prepend-icon="mdi-magic-staff" variant="flat">
					<div class="text-none font-weight-regular">
						合成音频
					</div>

					<v-dialog activator="parent" max-width="500">
						<template v-slot:default="{ isActive }">
							<v-card rounded="lg">
								<v-card-title class="d-flex justify-space-between align-center">
									<div class="text-h5 text-medium-emphasis ps-2">
										合成音频
									</div>

									<v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
								</v-card-title>

								<v-divider class="mb-4"></v-divider>

								<v-card-text>
									<AudioGenerate @load="isActive.value = false"> </AudioGenerate>
								</v-card-text>
							</v-card>
						</template>
					</v-dialog>
				</v-btn>
			</h3>
		</section>

		<div v-if="mapsStore.currentMapAudio" style="text-align: center;">
			<audio class="w-100 my-4" style="display: block;" controls controlsList="nodownload">
				<source :src="mapsStore.currentMapAudio.uri" />
			</audio>

			<v-btn variant="plain" class="mt-2" prepend-icon="mdi-close" @click="mapsStore.setCurrentMapAudio(null)">清除</v-btn>
		</div>

		<div v-else class="overflow-auto h-100" style="position: relative;">
			<AudioSelect component></AudioSelect>
		</div>
	</v-container>
</template>

<script setup>
import AudioGenerate from '@/pages/index/audio/generate.vue'
import AudioSelect from '@/pages/index/audio/index.vue'
import { useMapsStore } from '@/stores/data/maps'
import { ref } from 'vue'

const props = defineProps({
	disabled: Boolean,
	avatar: Object
})

const mapsStore = useMapsStore()

const audio = ref()
</script>