<template>
	<div ref="bgRef" class="bg ">
		<div ref="bgPanelRef" class="bg-panel">
			<AnimatePresence>
				<Motion v-if="!loading" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }">
					<div class="draggable-container" ref="draggableContainerRef">
						<vue-draggable-resizable v-if="mapsStore.currentMapAvatarLocation" ref="draggableResizableRef"
							:parent="true" :min-width="100" :min-height="100"
							:x="mapsStore.currentMapAvatarLocation.x * mapsStore.currentMapLocation.scale"
							:y="mapsStore.currentMapAvatarLocation.y * mapsStore.currentMapLocation.scale"
							:w="mapsStore.currentMapAvatarLocation.width * mapsStore.currentMapLocation.scale"
							:h="mapsStore.currentMapAvatarLocation.height * mapsStore.currentMapLocation.scale"
							:lock-aspect-ratio="true" style="position: absolute;" @resizing="updateAvatarLocation"
							@dragging="updateAvatarLocation">
							<img v-show="loadingAvatarImg" :src="mapsStore.currentMapAvatar.uri"
								style="width: 100%;height: 100%; object-fit: contain; object-position: top left;"
								tabindex="0" @keydown.delete="mapsStore.delAvatar()" />
						</vue-draggable-resizable>
					</div>
				</Motion>
			</AnimatePresence>

			<div class="bg-panel-range">
				<div v-if="mapsStore.currentMap && mapsStore.currentMap.bgUri.includes('mp4')" ref="bgVideo"
					id="xg-video" style="margin: auto;">
				</div>
				<img v-else-if="mapsStore.currentMap && (mapsStore.currentMap.bgUri.includes('png') || mapsStore.currentMap.bgUri.includes('jpg'))"
					ref="bgImg" class="scene_imag" :src="mapsStore.currentMap.bgUri"
					style=" max-width: 100%; max-height: 100%; object-fit: contain; display: block; margin: auto;" />
				<v-empty-state v-else class="w-100" image='/images/teamwork.png' style="transform: scale(2);">
					<template v-slot:title>
						<div class="text-subtitle-2 mt-8">
							需选择左侧场景
						</div>
					</template>
				</v-empty-state>
			</div>
		</div>
	</div>
	<!-- <div
		style="width: 50%; padding: 10px; z-index: 10000; background-color: aliceblue; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);">
		{{ mapsStore.currentMap }} {{ loadingAvatarImg }}
	</div> -->
</template>

<script setup>
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import { ref, onMounted, watch } from 'vue'
import Player, { Events } from 'xgplayer'
import 'xgplayer/dist/index.min.css';
import { useMapsStore } from '@/stores/data/maps'
import { useResizeObserver, refAutoReset } from '@vueuse/core'
import { AnimatePresence, Motion } from 'motion-v'

const loading = refAutoReset(false, 100)

const loadingAvatarImg = refAutoReset(true, 100)

loadingAvatarImg.value = false

const mapsStore = useMapsStore()

const bgRef = ref()

const bgPanelRef = ref()

const draggableContainerRef = ref()

const draggableResizableRef = ref()

const bgVideo = ref()

const bgImg = ref()

let player = null;

useResizeObserver(bgRef, (entries) => {
	const entry = entries[0]
	const { width, height } = entry.contentRect

	const scale = Math.min(width / 1920, height / 1080)

	bgPanelRef.value.style.transform = `scale(${scale})`
})

useResizeObserver(bgImg, (entries) => {
	const entry = entries[0]
	const { width, height } = entry.contentRect

	mapsStore.setCurrentMapLocation({
		original_width: mapsStore.currentMapLocation.original_width,
		original_height: mapsStore.currentMapLocation.original_height,
		width: width,
		height: height,
		scale: mapsStore.precision(width / mapsStore.currentMapLocation.original_width)
	})

	if (draggableContainerRef.value) {
		draggableContainerRef.value.style.width = `${width}px`
		draggableContainerRef.value.style.height = `${height}px`
	}
})

// 重置移动区域
const resetMovingArea = () => {
	if (draggableResizableRef.value && draggableResizableRef.value.checkParentSize) {
		draggableResizableRef.value.checkParentSize();
	}
}

const updateAvatarLocation = (x, y, w, h) => {
	if (mapsStore.currentMapAvatarLocation) {
		if (w && h) {
			mapsStore.currentMapAvatarLocation.width = w / mapsStore.currentMapLocation.scale;
			mapsStore.currentMapAvatarLocation.height = h / mapsStore.currentMapLocation.scale;
			mapsStore.currentMapAvatarLocation.scale = mapsStore.precision(mapsStore.currentMapAvatarLocation.width / mapsStore.currentMapAvatarLocation.original_width);
		}

		mapsStore.currentMapAvatarLocation.x = x / mapsStore.currentMapLocation.scale;
		mapsStore.currentMapAvatarLocation.y = y / mapsStore.currentMapLocation.scale;
	}
};

onMounted(() => {
	watch(draggableContainerRef, () => {
		if (draggableContainerRef.value && bgImg.value) {
			draggableContainerRef.value.style.width = `${bgImg.value.width}px`
			draggableContainerRef.value.style.height = `${bgImg.value.height}px`
			resetMovingArea()
		}
	})

	watch(() => {
		if (mapsStore.currentMap)
			return mapsStore.currentMap.id
		else return mapsStore.currentMap
	}, async () => {
		loading.value = true

		if (player) {
			player.destroy(true)
			player = null
		}

		if (mapsStore.currentMap) {
			if (mapsStore.currentMap.bgUri.includes('mp4')) {
				player = new Player({
					id: 'xg-video',
					url: mapsStore.currentMap.bgUri,
					height: '100%',
					fitVideoSize: 'fixHeight',
					autoplay: false,
					autoplayMuted: true
				});
				player.on(Events.LOADED_DATA, () => {
					mapsStore.setCurrentMapLocation({
						original_width: player.video.videoWidth,
						original_height: player.video.videoHeight,
						width: bgVideo.value.clientWidth,
						height: bgVideo.value.clientHeight,
						scale: mapsStore.precision(bgVideo.value.clientWidth / player.video.videoWidth)
					})
				})
			} else if (mapsStore.currentMap.bgUri.includes('png') || mapsStore.currentMap.bgUri.includes('jpg')) {
				const pictureSize = await mapsStore.getPictureSize(mapsStore.currentMap.bgUri)

				mapsStore.setCurrentMapLocation({
					original_width: pictureSize.width,
					original_height: pictureSize.height,
					width: bgImg.value.clientWidth,
					height: bgImg.value.clientHeight,
					scale: mapsStore.precision(bgImg.value.clientWidth / pictureSize.width)
				})
			}

			resetMovingArea()
		}
	}, { immediate: true })

	watch(() => {
		if (mapsStore.currentMapAvatar) {
			return mapsStore.currentMapAvatar.id
		} else return mapsStore.currentMapAvatar
	}, async () => {
		if (mapsStore.currentMapAvatar) {
			// 设置形象大小，保证可以在背景图片范围内
			if (mapsStore.currentMapAvatarLocation.width > mapsStore.currentMapLocation.original_width || mapsStore.currentMapAvatarLocation.height > mapsStore.currentMapLocation.original_height) {
				const scale_w = mapsStore.currentMapLocation.original_width / mapsStore.currentMapAvatarLocation.original_width;
				const scale_h = mapsStore.currentMapLocation.original_height / mapsStore.currentMapAvatarLocation.original_height;
				const scale = Math.min(scale_w, scale_h).toFixed(4);
				const width = mapsStore.currentMapAvatarLocation.original_width * scale * mapsStore.currentMapLocation.scale;
				const height = mapsStore.currentMapAvatarLocation.original_height * scale * mapsStore.currentMapLocation.scale;

				updateAvatarLocation(mapsStore.currentMapAvatarLocation.x, mapsStore.currentMapAvatarLocation.y, width, height)
			}
		}
	}, { immediate: true })
})

</script>

<style scoped>
.bg {
	position: relative;
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: center;
}

.bg-panel {
	position: relative;
	overflow: hidden;
	width: 1920px;
	height: 1080px;
	min-width: 1920px;
	min-height: 1080px;
	max-width: 1920px;
	max-height: 1080px;
}

.bg-panel-range {
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
}

.draggable-container {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 4;
}
</style>