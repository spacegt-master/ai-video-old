<template>
	<div class="generate-embedded" v-loading="loading" element-loading-text="正在处理,请勿操作...">
		<el-input class="title" v-model="title" placeholder="音频标题" maxlength="20" show-word-limit></el-input>
		<div class="el-tab-pane-content">
			<div class="form-item">
				<div class="form-item-label">
					音色:</div>
				<el-select v-model="modelId" placeholder="请选择语音" style="width: 25%;" @change="handleChangeEdgeTTSModel">
					<el-option v-for="item in voiceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-button style="margin-left: 20px; width: 20%;" icon="MagicStick" :disabled="!title || !text"
					@click="handleEdgeTTS()">
					<!-- Edge TTS -->生成
				</el-button>
			</div>
		</div>
		<div class="form">
			<el-input v-model="text" type="textarea" rows="8" placeholder="请输入文案" :maxlength="maxlength"
				show-word-limit>
			</el-input>
		</div>
	</div>
</template>

<script setup>
import { ElNotification } from 'element-plus'
import { task_edgetts, task_gpt_sovits_inference } from '@/api/ai-despatch.js'
import { ref, onMounted } from 'vue'
import { edge_tts_voices, gpt_sovits_tts_voices, } from '@/api/audio.js'
import { useAccountsStore } from '@/stores/data/accounts'

const accountsStore = useAccountsStore()
const emit = defineEmits(['change'])
const props = defineProps({
	maxlength: {
		type: Number,
		default: 1000
	}
})
const loading = ref(false)
const title = ref('')
const text = ref('')
const model = ref('')
const modelId = ref(null)
const voices = ref([])
const gptSovitsVoices = ref([])
const voiceList = ref([])

const handleEdgeTTS = async () => {
	loading.value = true
	if (model.value.remarks == 'tts') {
		try {
			model.value.id = model.value.id.split('tts')[0]
			const res = await task_edgetts(accountsStore.account.id, title.value, text.value, model.value.voice, 0, 0,
				0)
			emit('change', res)
		} catch (err) {
			ElNotification({
				title: '警告',
				message: err.response.data.message,
				type: "warning"
			})
		}
	} else {
		try {
			const res = await task_gpt_sovits_inference(accountsStore.account.id, title.value, model.value.modelName,
				model.value.promptAudio, model.value.promptText, text.value)
			emit('change', res)
		} catch (err) {
			ElNotification({
				title: '警告',
				message: err.response.data.message,
				type: "warning"
			})
		}
	}

	loading.value = false
}
const handleChangeEdgeTTSModel = (id) => {
	const item = voiceList.value.find(item => item.id == id)
	model.value = item
	modelId.value = id
}
const loadVoices = async () => {
	voices.value = await edge_tts_voices()
	voices.value.forEach(item => {
		item.id = item.id + 'tts'
		item.remarks = 'tts'
	})

	gptSovitsVoices.value = await gpt_sovits_tts_voices(accountsStore.account.id)
	if (Object.keys(gptSovitsVoices.value).length > 0) {
		console.log(gptSovitsVoices.value)
		gptSovitsVoices.value.forEach(item => {
			item.remarks = 'gpt-sovits'
		})
	}

	voiceList.value = [...gptSovitsVoices.value, ...voices.value]

	if (Object.keys(gptSovitsVoices.value).length > 0) {
		handleChangeEdgeTTSModel(gptSovitsVoices.value[0].id)
	} else {
		handleChangeEdgeTTSModel(voices.value[0].id)
	}
}

onMounted(() => {
	loadVoices()
})
</script>

<style scoped>
.generate-embedded {
	min-width: 380px;
	padding-left: 10px;
}

.title {
	position: absolute;
	top: 0;
	width: 300px;
	left: 50%;
	transform: translateX(-50%);
}

.form {
	margin-top: 10px;
	display: flex;
	gap: 20px;
}

.form>.el-textarea {
	flex: 60;
}

.form>.el-tabs {
	flex: 40;
}

.el-tab-pane-content {
	display: flex;
	flex-direction: column;
}

.el-tab-pane-content .form-item {
	display: flex;
	align-items: center;
	margin-top: 10px;
}

.el-tab-pane-content .form-item-label {
	font-size: 14px;
	font-weight: 700;
	min-width: 50px;
	letter-spacing: 2px;
}

.el-tab-pane-content .submit {
	margin-top: 10px;
	margin-left: 0;
}
</style>