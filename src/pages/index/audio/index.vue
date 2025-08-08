<template>
	<v-container fluid max-width="1600px" :class="{ 'pa-6': !component, 'pa-md-12': !component }">
		<v-responsive v-if="!component" max-width="100%">
			<div class="d-flex justify-space-between align-center mb-4 flex-wrap ">
				<p class="font-weight-bold text-h4 ">
					我的声音 ({{ audioStore.items.length }})
				</p>
				<v-btn class="text-none px-0" color="primary" :ripple="false" text="上传本地音频" variant="plain"
					@click="uploadFileDialog = true" />
			</div>
		</v-responsive>

		<v-row>
			<v-col cols="12" :lg="component ? 12 : 6" :xl="component ? 12 : 8">
				<v-container class="mt-6" :class="{ 'pa-0': component }">
					<div class="d-flex ga-4 flex-wrap align-content-start w-100">
						<div class="audio" v-for="(item, index) in audioStore.items" :key="item.id"
							:style="{ 'width': component ? '150px' : '200px', 'height': component ? '100px' : '150px' }"
							@click="handleOpen(item)">
							<img src="@/assets/audio.png" :style="{ 'height': component ? '60px' : '' }" />

							<p class="font-weight-bold text-body-1 mt-2" @click.stop="() => { }"
								@dblclick="updateName(item.id, item.name)"> {{ item.name }}
							</p>

							<div class="audio-del">
								<v-btn variant="plain" size="small" icon="mdi-rename" density="comfortable"
									@click.stop="updateName(item.id, item.name)"></v-btn>

								<v-btn variant="plain" size="small" icon="mdi-delete" density="comfortable"
									@click.stop="handleDel(item.id)"></v-btn>
							</div>
						</div>
					</div>
				</v-container>
			</v-col>

			<v-col v-if="!component" cols="12" lg="6" xl="4">
				<v-card title="合成音频">
					<template #text>
						<Generate ref="generateRef" @load="audioStore.load()"></Generate>
					</template>
				</v-card>
			</v-col>
		</v-row>

		<v-bottom-sheet content-class="audio-play" inset v-model="sheet">
			<v-sheet class="pa-4 rounded-lg	 mb-4">
				<section>
					<h3 class="text-subtitle-1 font-weight-bold mb-2 d-flex justify-space-between align-center">
						{{ music.name }}

						<v-btn prepend-icon="mdi-rename" variant="text"
							@click="generateRef.init({ text: music.text }); sheet = false">编辑文案</v-btn>
					</h3>

					<div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
						{{ music.text }}
					</div>
				</section>
				<audio class="w-100" style="display: block;" controls controlsList="nodownload">
					<source :src="music.src" />
				</audio>
			</v-sheet>
		</v-bottom-sheet>

		<v-dialog v-model="renameDialog" width="auto">
			<v-card width="500" prepend-icon="mdi-rename" title="重命名">
				<template #default>
					<div class="px-6">
						<v-text-field v-model="newname" label="新文件名" variant="solo"
							@keyup.enter="onUpdateName"></v-text-field>
					</div>
				</template>
				<template v-slot:actions>
					<v-btn class="ms-auto" text="Ok" :disabled="!newname" @click="onUpdateName"></v-btn>
				</template>
			</v-card>
		</v-dialog>

		<v-dialog v-model="uploadFileDialog" width="auto">
			<v-card width="500" prepend-icon="mdi-upload" title="上传本地文件">
				<template #default>
					<div class="px-6">
						<v-file-upload density="default" v-model="file" accept=".mp3,.wav"></v-file-upload>
					</div>
				</template>
				<template v-slot:actions>
					<v-btn class="ms-auto" text="Ok" :disabled="!file" @click="onUpdateFile"></v-btn>
				</template>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup>
import Generate from './generate.vue'
import { ref, onMounted, nextTick } from 'vue'
import { AudioApi } from '@/api/audio'
import { filePath, upload } from '@/api/io.js'
import { useAudioStore } from '@/stores/data/audio'
import { useMapsStore } from '@/stores/data/maps'

const mapsStore = useMapsStore()
const audioStore = useAudioStore()

const emit = defineEmits(['selected'])

const props = defineProps({
	component: {
		type: Boolean,
		default: false
	}
})
const music = ref()
const generateRef = ref()
const audioDialogVisible = ref(false)

const sheet = ref(false)

const renameDialog = ref(false)
const renameid = ref()
const newname = ref('')

const uploadFileDialog = ref(false)
const file = ref()

const handleDel = async (id) => {
	await AudioApi.del(id)
	await audioStore.load()
}

const onUpdateFile = async () => {
	const e = await upload(file.value, 'ai-video-old/audio')
	await AudioApi.save({ name: e.name, duration: e.duration, uri: filePath + e.url })
	await audioStore.load()
	uploadFileDialog.value = false
}
const handleOpen = (data) => {
	console.log(data)
	if (props.component) {
		mapsStore.setCurrentMapAudio(data)
	} else {
		music.value = null
		nextTick(() => {
			sheet.value = true
			music.value = {
				name: data.name,
				src: data.uri,
				text: data.config ? JSON.parse(data.config).text : ''
			}
		})
	}
}

const updateName = (id, name) => {
	renameDialog.value = true
	renameid.value = id
	newname.value = name
}
const onUpdateName = async () => {
	await AudioApi.rename(renameid.value, newname.value)
	audioStore.load()
	renameDialog.value = false
}

const open = () => {
	audioDialogVisible.value = true
}
const close = () => {
	audioDialogVisible.value = false
}

onMounted(() => {
	audioStore.load()
})

defineExpose({
	open,
	close
})
</script>

<style>
.audio-play {
	box-shadow: none !important;
}
</style>

<style scoped>
.audio {
	position: relative;
	overflow: initial;
	transition: all 0.2s;
	border-radius: 5px;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.audio:hover {
	transform: scale(1.1);
}

.audio img {
	height: 100px;
	width: 100%;
	object-fit: contain;
}

.audio p {
	margin: auto;
	text-align: center;
	margin-top: 0px;
	max-width: 80%;
	overflow: hidden;
	text-overflow: ellipsis;
	text-wrap: nowrap;
}

.audio-del {
	display: none;
	position: absolute;
	top: 0px;
	right: 10px;
}

.audio:hover .audio-del {
	display: initial;
}

.audio.selected {
	background-color: #ccc;
}

.audio .subtitle {
	position: absolute;
	top: 5px;
	left: 5px;
}
</style>