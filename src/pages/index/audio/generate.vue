<template>
	<v-container>
		<div style="display: flex;flex-direction: column;">
			<v-text-field v-model="title" label="音频标题"></v-text-field>

			<v-select v-model="selectedVoice" label="选择声音" item-value="voice" item-title="voiceName"
				:items="voices"></v-select>

			<div class="text-caption">媒体音量</div>

			<v-slider v-model="volume" prepend-icon="mdi-volume-high" :min="1.0" :max="10.0"></v-slider>

			<div class="text-caption">音高强度</div>

			<v-slider v-model="pitch" prepend-icon="mdi-volume-high" :min="0" :max="10.0"></v-slider>

			<div class="text-caption">说话速度</div>

			<v-slider v-model="speed" prepend-icon="mdi-volume-high" :min="1.0" :max="2.0"></v-slider>

			<v-textarea v-model="text" label="请输入文案" :loading="loading"></v-textarea>

			<v-btn prepend-icon="mdi-magic-staff" :disabled="!title || !text" :loading="loading"
				@click="onTTS()">开始合成</v-btn>
		</div>
	</v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { list } from '@/api/avatar.js'
import {   AudioApi } from '@/api/audio'
import { useAudioStore } from '@/stores/data/audio'

const audioStore = useAudioStore()

const emit = defineEmits(['load'])
const loading = ref(false)
const title = ref('')
const text = ref('')
const speed = ref(0)
const volume = ref(0)
const pitch = ref(0)
const selectedVoice = ref()
const voices = ref([])

const onTTS = async () => {
	loading.value = true

	const res = await AudioApi.tts({
		pitch: pitch.value,
		voice: selectedVoice.value,
		speed: speed.value,
		volume: volume.value,
		text: text.value,
	})

	await AudioApi.save(title.value, res.duration, res.audio_url, JSON.stringify({ pitch: pitch.value, voice: selectedVoice.value, speed: speed.value, volume: volume.value, text: text.value, }))

	await audioStore.load()

	emit('load')

	nextTick(() => {
		title.value = ''
		text.value = ''
	})

	loading.value = false
}

const loadVoices = async () => {
	voices.value = await list()

	if (voices.value?.at(0))
		selectedVoice.value = voices.value.at(0).voice
}

onMounted(() => {
	loadVoices()
})
</script>

<style></style>