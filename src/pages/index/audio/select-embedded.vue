<template>
	<el-scrollbar height="220px">
		<div style="padding: 10px;height: 100%; box-sizing: border-box;">
			<div style="display: flex;height:100%; ">
				<el-scrollbar style="width: 100%;">
					<div style="display: flex; gap: 16px; flex-wrap: wrap; align-content: flex-start; width: 100%;">
						<div class="audio" v-for="(item, index) in audios" :key="item.id" @click="onclick(item)">
							<img src="@/assets/music&audio.svg" />
							<p @dblclick="handleRename(item.id)">
								{{ item.name }}
							</p>
							<el-tag v-if="item.subtitle" class="subtitle">
								字幕
							</el-tag>
						</div>
					</div>
				</el-scrollbar>
			</div>
		</div>
	</el-scrollbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { list } from '@/api/audio.js'
import { useAccountsStore } from '@/stores/data/accounts'

const accountsStore = useAccountsStore()
const emit = defineEmits(['selected'])
const audios = ref([])

const onclick = (audio) => {
	emit('selected', audio)
}
const handleSelect = (e) => {
	if (selectAudio.value.includes(e)) {
		const index = selectAudio.value.findIndex(item => item.id == e.id)
		selectAudio.value.splice(index, 1)
	} else {
		if (props.limit <= selectAudio.value.length) {
			selectAudio.value.splice(0, 1)
		}
		selectAudio.value.push(e)
	}
}
const loadAudios = async () => {
	audios.value = await list(accountsStore.account.id)
}

onMounted(() => {
	loadAudios()
})
</script>
<style scoped>
.audio {
	position: relative;
	width: 120px;
	height: 90px;
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
	height: 50px;
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
	text-align: center;
	margin-top: 0;
	font-size: 12px;
}

.audio .subtitle {
	position: absolute;
	top: 5px;
	left: 5px;
	font-size: 12px;
}
</style>