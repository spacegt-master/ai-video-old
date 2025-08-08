<template>
	<v-container>
		<div style="display: flex;flex-direction: column;">
			<v-text-field v-model="title" label="音频标题"></v-text-field>

			<v-select v-model="selectedVoice" label="选择声音" item-value="name" item-title="displayName" :items="voices">
				<template v-slot:item="{ props: itemProps, item }">
					<v-list-item prepend-icon="mdi-account-voice" v-bind="itemProps"
						:subtitle="`${ageGroupItems.find(agItem => agItem.value == item.raw.ageGroups)?.title} , ${genderItems.find(gItem => gItem.value == item.raw.gender)?.title}`">
						<template #append v-if="item.raw.type == 'PRIVATE'">
							<div class="text-overline mb-2">💎 定制</div>
						</template>
					</v-list-item>
				</template>

				<template #append-inner>
					<v-btn variant="plain" prepend-icon="mdi-account-voice"
						@click.stop="customDialog = true">定制声音</v-btn>
				</template>
			</v-select>

			<!-- <div class="text-caption">媒体音量</div>

			<v-slider v-model="volume" prepend-icon="mdi-volume-high" :min="1.0" :max="10.0"></v-slider>

			<div class="text-caption">音高强度</div>

			<v-slider v-model="pitch" prepend-icon="mdi-volume-high" :min="0" :max="10.0"></v-slider>

			<div class="text-caption">说话速度</div>

			<v-slider v-model="speed" prepend-icon="mdi-volume-high" :min="1.0" :max="2.0"></v-slider> -->

			<v-textarea v-model="text" label="请输入文案" :loading="loading"></v-textarea>

			<v-btn prepend-icon="mdi-magic-staff" :disabled="!title || !text" :loading="loading"
				@click="onTTS()">开始合成</v-btn>
		</div>


		<v-dialog v-model="customDialog" max-width="800" persistent>
			<v-card title="定制声音" prepend-icon="mdi-account-voice" :loading="customLoading">
				<template #append>
					<v-btn variant="plain" icon="mdi-close" @click="customDialog = false"></v-btn>
				</template>

				<v-card-text>
					<div class="d-flex">
						<v-select v-model="customForm.source" label="AI 源" :items="sourceItmes" disabled
							max-width="50%"></v-select>
						<v-select v-model="customForm.type" label="公开类型" :items="typeItems" disabled
							max-width="50%"></v-select>
					</div>
					<div class="d-flex">
						<v-text-field v-model="customForm.displayName" label="声音名称" max-width="50%"></v-text-field>
						<v-select v-model="customForm.locale" label="语言" :items="locales" item-value="locale"
							item-title="label" max-width="50%"></v-select>
					</div>
					<div class="d-flex">
						<v-select v-model="customForm.gender" label="性别" :items="genderItems"
							max-width="50%"></v-select>
						<v-select v-model="customForm.ageGroups" label="年龄组" :items="ageGroupItems"
							max-width="50%"></v-select>
					</div>

					<v-text-field v-model="customForm.description" label="描述"></v-text-field>

					<v-file-upload v-model="customForm.audioFile" accept=".mp3,.wav" density="compact"
						title="在此处点击或拖放音频素材文件"></v-file-upload>

					<ul class="ml-6 mt-4 text-caption">
						<li> 音频格式：MP3、WAV。 </li>
						<li> 音频时长：10 - 90 秒。 </li>
					</ul>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn text="关闭" variant="plain" :disabled="customLoading" @click="customDialog = false"></v-btn>

					<v-btn color="primary" text="提交" variant="tonal"
						:disabled="!customForm.audioFile || !customForm.displayName" :loading="customLoading"
						@click="onCustomVoiceSubmit()"></v-btn>
				</v-card-actions>
			</v-card>

			<v-overlay v-model="customLoading" class="align-center justify-center" contained persistent>
				<v-list class="py-2" color="primary" elevation="12" rounded="lg">
					<v-list-item prepend-icon="mdi-account-voice" title="正在训练您的专属声音...">
						<template v-slot:prepend>
							<div class="pe-4">
								<v-icon color="primary" size="x-large"></v-icon>
							</div>
						</template>

						<template v-slot:append>
							<v-progress-circular color="primary" indeterminate="disable-shrink" size="16"
								width="2"></v-progress-circular>
						</template>
					</v-list-item>
				</v-list>
			</v-overlay>
		</v-dialog>
	</v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { AudioApi } from '@/api/audio'
import { useAudioStore } from '@/stores/data/audio'
import { VoicesApi } from '@/api/voices'
import locales from '@/assets/data/locales.json'

const audioStore = useAudioStore()

const emit = defineEmits(['load'])
const loading = ref(false)
const title = ref('')
const text = ref('')
const speed = ref(1.0)
const volume = ref(1.0)
const pitch = ref(1.0)
const selectedVoice = ref()
const voices = ref([])


const sourceItmes = [
	{ value: 'Index TTS', title: 'Index TTS' },
]

const typeItems = [
	{ value: 'PRIVATE', title: '私有' },
]

const genderItems = [
	{ value: 'Male', title: '男性' },
	{ value: 'Female', title: '女性' }
]

const ageGroupItems = [
	{ value: 'Child', title: '儿童' },
	{ value: 'YoungAdult', title: '年轻人' },
	{ value: 'Adult', title: '成人' },
	{ value: 'Senior', title: '老年' }
]

const customDialog = ref(false)
const customLoading = ref(false)
const customForm = ref({
	displayName: '',
	source: 'Index TTS',
	type: 'PRIVATE',
	locale: 'zh-CN',
	ageGroups: 'Adult',
	gender: 'Male',
	description: '',
	audioFile: null
})

const onTTS = async () => {
	loading.value = true

	const res = await VoicesApi.synthesis({ name: selectedVoice.value, text: text.value })

	await AudioApi.save({
		name: title.value,
		duration: res.duration,
		uri: res.url,
		config: JSON.stringify({ pitch: pitch.value, voice: selectedVoice.value, speed: speed.value, volume: volume.value, text: text.value },),
	})

	await audioStore.load()

	emit('load')

	nextTick(() => {
		title.value = ''
		text.value = ''
	})

	loading.value = false
}

async function onCustomVoiceSubmit() {
	customLoading.value = true

	await VoicesApi.training({
		displayName: customForm.value.displayName,
		source: customForm.value.source,
		type: customForm.value.type,
		locale: customForm.value.locale,
		ageGroups: customForm.value.ageGroups,
		gender: customForm.value.gender,
		description: customForm.value.description,
		file: customForm.value.audioFile
	})

	loadVoices()

	customDialog.value = false
	customLoading.value = false
}

const loadVoices = async () => {
	voices.value = await VoicesApi.list()

	if (voices.value?.at(0))
		selectedVoice.value = voices.value.at(0).name
}

onMounted(() => {
	loadVoices()
})

function init(data) {
	text.value = data.text
}

defineExpose({
	init
})


</script>

<style></style>