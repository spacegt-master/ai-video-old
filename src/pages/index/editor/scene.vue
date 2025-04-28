<template>
	<v-container class="pa-0 w-100 h-100 overflow-hidden position-absolute pt-14 top-0">
		<v-file-upload v-model="file" density="compact" icon="" width="100%" height="80px"
			accept=".pptx,.ppt,.jpg,.png" @update:model-value="onUploadFile">
			<template #title>
				<p class="text-button">导入（图片 / PPT）</p>
			</template>
			<template #item></template>
		</v-file-upload>

		<v-container v-show="!isShow" class="my-2 overflow-auto " style="height: calc(100% - 140px);">
			<VueDraggable v-model="mapsStore.maps" animation="150" :onUpdate="onUpdate">
				<v-hover v-for="(item, index) in mapsStore.maps" :key="item.id">
					<template v-slot:default="{ isHovering, props }">
						<v-card class="mb-4" v-bind="props" :color="isHovering ? 'primary' : undefined">
							<div ref="sceneRef" :key="item.id" class="h-100 w-100 border-lg border-opacity-50 "
								:class="mapsStore.currentIndex == index ? 'border-info' : 'border-surface'"
								@click="mapsStore.setCurrentIndex(index)">
								<video v-if="item.bgUri.includes('mp4')">
									<source :src="item.bgUri" type="video/mp4">
									<source :src="item.bgUri" type="video/ogg">
									<source :src="item.bgUri" type="video/webm">
								</video>

								<v-img v-else :src="item.bgUri" min-height="100px"
									lazy-src="https://picsum.photos/id/11/300/200">
									<template v-slot:placeholder>
										<div class="d-flex align-center justify-center fill-height">
											<v-progress-circular color="grey-lighten-4"
												indeterminate></v-progress-circular>
										</div>
									</template>
								</v-img>

								<v-speed-dial location="bottom center" transition="fade-transition">
									<template v-slot:activator="{ props: activatorProps }">
										<v-btn variant="plain" v-bind="activatorProps"
											class="position-absolute	top-0 right-0 ma-2" size="small"
											icon="mdi-cog-outline"></v-btn>
									</template>

									<v-btn key="1" icon="mdi-arrow-up" @click="mapsStore.moveUp(index)"></v-btn>
									<v-btn key="2" icon="mdi-arrow-down" @click="mapsStore.moveDown(index)"></v-btn>
									<v-btn key="3" icon="mdi-close" @click="mapsStore.delMap(index)"></v-btn>
								</v-speed-dial>
							</div>
						</v-card>
					</template>
				</v-hover>
			</VueDraggable>
		</v-container>

		<v-progress-circular v-if="isShow" class="w-100 my-16" :size="70" :width="7" color="purple"
			indeterminate></v-progress-circular>

		<v-btn v-if="mapsStore.maps.length > 0" class="w-100" prepend-icon="mdi-close"
			@click="mapsStore.clearMaps">清除所有</v-btn>
	</v-container>
</template>

<script setup>
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { VueDraggable } from 'vue-draggable-plus'
import { ref, nextTick } from 'vue'
import { filePath, uploadTo, ppt2imageTo } from '@/api/io.js'
import { ElNotification } from 'element-plus';
import { useMapsStore } from '@/stores/data/maps'

const mapsStore = useMapsStore()

const file = ref()

const sceneRef = ref([])

const isShow = ref(false)

const onUploadFile = async (file) => {
	if (file.name.split('.').pop() == "ppt" || file.name.split('.').pop() == "pptx") {
		const res = await ppt2imageTo(file, (e) => {
			isShow.value = true
		})
		res.forEach(item => {
			mapsStore.addMap({ id: item.id, name: item.name, bgUri: filePath + item.url })
		})
		isShow.value = false

		ElNotification({ title: '上传成功', type: 'success', })
	} else {
		try {
			const res = await uploadTo(file, "scene", (e) => {
				isShow.value = true
			})
			mapsStore.addMap({ id: res.id, name: res.name, bgUri: filePath + res.url })

			nextTick(() => {
				let videos = document.querySelectorAll('video');
				videos.forEach(video => video.currentTime = 3)
			})
			ElNotification({ title: '上传成功', type: 'success', })
			isShow.value = false
		} catch (e) {
			ElNotification({ title: '上传失败', type: 'error', })
		}
	}
	mapsStore.setCurrentIndex(0)
}

const onUpdate = () => { }
</script>