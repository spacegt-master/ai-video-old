<template>
	<v-container v-if="component" fluid>
		<v-responsive max-width="800">
			<p class="font-weight-bold text-h5">
				我的形象
			</p>
		</v-responsive>

		<v-row class="mt-4">
			<v-col v-for="(item, i) in items" :key="i" cols="12">
				<v-hover v-slot="{ isHovering, props: hoverProps }">
					<v-card class="mx-auto" flat link :ripple="false" rounded="lg" v-bind="hoverProps"
						@click="onSelectedAvatar(item)">
						<v-img :aspect-ratio="4 / 5" block cover :src="item.uri" />

						<v-overlay class="align-center justify-center" contained :model-value="isHovering" persistent
							scrim="surface" />
					</v-card>
				</v-hover>

				<p class="text-body-2 text-medium-emphasis mt-3">{{ item.voiceName }}</p>
				<p class="font-weight-bold text-body-1"> {{ item.name }}</p>
			</v-col>
		</v-row>

		<v-dialog v-model="selectedPromptDrawer" contained max-width="500">
			<v-card rounded="lg" title="更换形象">
				<template #prepend>
					<v-avatar color="info" icon="mdi-account-arrow-left-outline" variant="tonal" />
				</template>

				<template #text>
					<div class="mb-4 text-body-2 text-medium-emphasis">
						是否更换新的形象。
					</div>

				</template>

				<v-divider />

				<v-card-actions class="bg-surface-light">
					<v-spacer />

					<v-btn border class="text-none" color="surface" text="取消" variant="flat"
						@click="selectedPromptDrawer = false" />

					<v-btn class="text-none" color="info" text="确定" variant="flat" @click="onSelectedAvatarConfirm" />
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>

	<v-container v-else class="pa-6 pa-md-12" max-width="1600px" fluid>
		<v-responsive max-width="100%">
			<div class="pt-2 font-weight-bold text-h4 d-flex justify-space-between">
				我的形象

				<div>
					<v-dialog max-width="800">
						<template v-slot:activator="{ props: activatorProps }">
							<v-btn class="mr-2" v-bind="activatorProps" size="large" color="indigo-darken-3"
								variant="flat" prepend-icon="mdi-account-box">上传静态形象</v-btn>
						</template>

						<template v-slot:default="{ isActive }">
							<v-card title="上传静态形象" prepend-icon="mdi-account-box" :loading="staticLoading">
								<v-card-text>
									<v-text-field v-model="staticName" label="形象名称"></v-text-field>

									<v-file-upload v-model="staticFile" accept=".jpeg,.jpg,.png,.bmp,.webp"
										@update:model-value="handleUpdateStaticFile"></v-file-upload>

									<ul class="ml-6 mt-4 text-caption">
										<li> 图像格式：JPEG、JPG、PNG（不支持8位、16位、64位PNG）、BMP、WEBP。 </li>
										<li> 图像大小：不超过3 MB。 </li>
										<li> 图像分辨率：小于2000×2000像素。 </li>
									</ul>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>

									<v-btn text="关闭" variant="plain" @click="isActive.value = false"></v-btn>

									<v-btn color="primary" text="提交" variant="tonal"
										:disabled="!staticFile || !staticName" :loading="staticLoading"
										@click="onStaticFileSubmit(isActive)"></v-btn>
								</v-card-actions>
							</v-card>
						</template>
					</v-dialog>

					<v-dialog max-width="800">
						<template v-slot:activator="{ props: activatorProps }">
							<v-btn class="mr-2" v-bind="activatorProps" size="large" color="grey-lighten-3"
								variant="flat" prepend-icon="mdi-video-account">上传动态形象</v-btn>
						</template>

						<template v-slot:default="{ isActive }">
							<v-card title="上传动态形象" prepend-icon="mdi-account-box" :loading="dynamicLoading">
								<v-card-text>
									<v-text-field v-model="dynamicName" label="形象名称"></v-text-field>

									<v-file-upload v-model="dynamicFile" accept=".mp4,.avi,.flv,.mov"
										@update:model-value="handleUpdateStaticFile"></v-file-upload>

									<ul class="ml-6 mt-4 text-caption">
										<li> 视频格式：MP4、AVI、FLV、MOV。 </li>
										<li> 视频大小：不超过1 GB。 </li>
										<li> 视频要求总帧数不超过2000帧。 </li>
									</ul>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>

									<v-btn text="关闭" variant="plain" @click="isActive.value = false"></v-btn>

									<v-btn color="primary" text="提交" variant="tonal"
										:disabled="!dynamicFile || !dynamicName" :loading="dynamicLoading"
										@click="onDynamicFileSubmit(isActive)"></v-btn>
								</v-card-actions>
							</v-card>
						</template>
					</v-dialog>


				</div>
			</div>

			<p class="mt-2 text-subtitle-1 text-medium-emphasis">
				本功能适用于真人图片，不适用于卡通图片。
			</p>
		</v-responsive>

		<v-row class="mt-4">
			<v-col v-for="(item, i) in items" :key="item.id" cols="12" md="3" sm="6">
				<v-hover v-slot="{ isHovering, props: hoverProps }">
					<a :href="item.uri" class="glightbox">
						<v-card class="mx-auto" flat link :ripple="false" rounded="lg" v-bind="hoverProps">
							<v-img :aspect-ratio="4 / 5" block cover :src="item.uri" />

							<v-overlay class="align-center justify-center" contained :model-value="isHovering"
								persistent scrim="surface" />
						</v-card>
					</a>
				</v-hover>

				<p class="text-body-2 text-medium-emphasis mt-3">{{ item.voiceName }}</p>
				<p class="font-weight-bold text-body-1"> {{ item.name }}</p>
			</v-col>
		</v-row>

	</v-container>
</template>

<script setup>
import GLightbox from 'glightbox';
import { ref, onMounted } from 'vue'
import { FileApi, useAccountsStore } from 'spacegt'
import { useMapsStore } from '@/stores/data/maps';
import { ImagesegApi, VideosegApi } from '@/api/multi-tool-hub';
import { AvatarApi } from '@/api/avatar';

const mapsStore = useMapsStore()
const accountsStore = useAccountsStore()
const emit = defineEmits(['selected'])
const props = defineProps({
	component: {
		type: Boolean,
		default: false
	}
})
const items = ref([])

const selectedItem = ref()

const selectedPromptDrawer = ref(false)

const staticName = ref()
const staticFile = ref()
const staticLoading = ref(false)
const dynamicName = ref()
const dynamicFile = ref()
const dynamicLoading = ref(false)

const onSelectedAvatar = (item) => {
	if (mapsStore.currentMapAvatar != null) {
		selectedPromptDrawer.value = true

		selectedItem.value = item
	} else {
		mapsStore.setCurrentMapAvatar(item)
	}
}

const onSelectedAvatarConfirm = () => {
	mapsStore.setCurrentMapAvatar()

	mapsStore.setCurrentMapAvatar(selectedItem.value)

	selectedPromptDrawer.value = false
}

function handleUpdateStaticFile(file) {
	staticFile.value = file
}

async function onStaticFileSubmit(isActive) {
	staticLoading.value = true

	const res = await ImagesegApi.segmentBody({ Image: staticFile.value })
 
	await AvatarApi.save({
		name: staticName.value,
		uri: res.url,
		type: 'image',
		avatarUrl: res.url,
	})

	loadAvatars()

	isActive.value = false
	staticLoading.value = false
}

async function onDynamicFileSubmit(isActive) {
	dynamicLoading.value = true

	// 上传形象
	const avatarConfig = await FileApi.upload(dynamicFile.value, 'ai-video-old/avatar')

	// 获取形象遮罩
	const maskResponse = await VideosegApi.segmentVideoBody({ Video: dynamicFile.value })

	// 处理封面背景
	const coverFileName = 'cover' + avatarConfig.cover.substring(avatarConfig.cover.lastIndexOf('.'))
	const coverFile = await downloadUrlAsFile(FileApi.filePath + '/' + avatarConfig.cover, coverFileName);
	const coverResponse = await ImagesegApi.segmentBody({ Image: coverFile })
 
	await AvatarApi.save({
		name: dynamicName.value,
		uri: coverResponse.url,
		type: 'video',
		avatarUrl: FileApi.filePath + '/' + avatarConfig.url,
		maskUrl: maskResponse.url
	})


	loadAvatars()

	isActive.value = false
	dynamicLoading.value = false
}

const loadAvatars = async () => {
	items.value = await AvatarApi.list(accountsStore.account.id)

	setTimeout(() => GLightbox(), 300)
}

onMounted(() => {
	loadAvatars()
})

async function downloadUrlAsFile(url, fileName) {
	try {
		// 1. 使用 fetch 请求图片数据
		const response = await fetch(url);

		// 检查响应是否成功
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// 2. 将响应数据转换为 Blob
		const blob = await response.blob();

		// 3. 从 Blob 创建 File 对象
		// 第三个参数是一个选项对象，用于设置文件类型等
		const file = new File([blob], fileName, { type: blob.type });

		return file;

	} catch (error) {
		console.error('下载图片失败:', error);
		return null;
	}
}
</script>
<style></style>