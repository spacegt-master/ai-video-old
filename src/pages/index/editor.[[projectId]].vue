<template>
	<v-container class="pa-4" max-width="100%" height="100%" fluid>
		<div class="d-flex h-100">
			<div class="left position-relative">
				<v-btn class="w-100 mb-4 " style="z-index: 10;" append-icon="mdi-pencil" @click="renameDialog = true">
					<p class="text-truncate" style="width: 12rem;">
						{{ projectName }}（可编辑）
					</p>
				</v-btn>

				<EditorScene></EditorScene>
			</div>

			<div class="center">
				<!-- <div style="margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;">
					<v-btn prepend-icon="mdi-arrow-left" @click="onRevocation">撤销</v-btn>
					<v-btn prepend-icon="mdi-arrow-right" class="ml-2" :disabled="reformStep.length == 0"
						@click="onReform">重做</v-btn>
					<v-btn prepend-icon="mdi-cursor-move" class="ml-2"
						@click="editorSceneAvatarLocationRef.open()">同步数字人形象位置</v-btn>
					<EditorSceneAvatarLocation ref="editorSceneAvatarLocationRef" @selected="handleSceneAvatarLocation">
					</EditorSceneAvatarLocation>
				</div> -->
				<div class="blueprint border-dashed border-thin overflow-hidden rounded-lg	">
					<EditorBlueprint />
				</div>

				<EditorCopywriter style="margin-bottom: 10px;" ref="editorCopywriterRef">
				</EditorCopywriter>
			</div>
			<div class="right">
				<div class="digital-human">
					<EditorAvatar component> </EditorAvatar>
				</div>
				<div class="operate">
					<v-btn class="w-100" prepend-icon="mdi-content-save-check-outline" @click="onSaveProject">
						保存项目
					</v-btn>
					<v-btn class="w-100 mt-1" prepend-icon="mdi-timer-sand-complete" color="indigo-darken-3"
						@click="generateDialogVisible = true; title = projectName">
						合成
					</v-btn>
				</div>
			</div>
			<EditorHint ref="editorHintRef"></EditorHint>
		</div>

		<v-dialog v-model="renameDialog" width="auto">
			<v-card width="500" prepend-icon="mdi-rename" title="重命名">
				<template #default>
					<div class="px-6">
						<v-text-field v-model="projectName" label="新项目名" variant="solo"></v-text-field>
					</div>
				</template>
				<template v-slot:actions>
					<v-btn class="ms-auto" text="Ok" @click="renameDialog = false"></v-btn>
				</template>
			</v-card>
		</v-dialog>

		<v-dialog v-model="loadDialog" contained max-width="500">
			<v-card rounded="lg">
				<template #text>
					<div class="text-center pt-4">
						<v-avatar class="mb-4" color="warning" icon="mdi-alert-outline" size="x-large"
							variant="tonal" />

						<div class="font-weight-bold mb-2">
							加载场景
						</div>

						<div class="text-body-2 text-medium-emphasis mb-6">
							是否加载上次场景？
						</div>

						<div class="d-flex ga-4">
							<v-btn border class="text-none flex-1-1-100" color="surface" text="取消" variant="flat"
								@click="loadDialog = false" />

							<v-btn class="text-none flex-1-1-100" color="primary" text="加载" variant="flat" />
						</div>
					</div>
				</template>
			</v-card>
		</v-dialog>

		<v-dialog v-model="generateDialogVisible" contained max-width="500">
			<v-card rounded="lg" title="项目合成">
				<template #prepend>
					<v-avatar color="info" icon="mdi-timer-sand-complete" variant="tonal" />
				</template>

				<template #text>
					<div class="mb-4 text-body-2 text-medium-emphasis">
						当前场景预计消耗 {{ expectedConsumptionTime.current }} 点时长,所有场景预计消耗 {{ expectedConsumptionTime.all }}
						点时长。
					</div>

					<v-text-field v-model="title" color="info" density="compact" placeholder="视频标题" />
				</template>

				<v-divider />

				<template #actions>
					<v-spacer />

					<v-btn class="text-none" text="取消" variant="flat" @click="generateDialogVisible = false" />

					<v-btn border class="text-none" text="合成所有场景" variant="flat" @click="generate(true)" />
					<v-btn class="text-none" color="info" text="合成当前场景" variant="flat" @click="generate(false)" />
				</template>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup>
import EditorScene from '@/pages/index/editor/scene.vue'
import EditorAvatar from '@/pages/index/avatar.vue'
import EditorCopywriter from '@/pages/index/editor/copywriter.vue'
import EditorHint from '@/pages/index/editor/hint.vue'
import EditorBlueprint from '@/pages/index/editor/blueprint.vue'
import { ElNotification } from 'element-plus'
import { ref, onMounted, computed, watch } from 'vue'
import { DurationApi } from '@/api/duration'
import { ProjectApi } from '@/api/project.ts'
import { useAccountsStore } from '@/stores/data/accounts'
import { useMapsStore } from '@/stores/data/maps'
import { TaskApi } from '@/api/task'
import { useRoute, useRouter } from 'vue-router'
import { useHintStore } from '@/stores/data/hint';
import { useDurationStore } from '@/stores/data/duration'

const accountsStore = useAccountsStore()
const mapsStore = useMapsStore()
const route = useRoute()
const router = useRouter()
const hintStore = useHintStore()
const durationStore = useDurationStore()

const generateDialogVisible = ref(false)
const editorCopywriterRef = ref()
const editorHintRef = ref()
const loading = ref(false)
const title = ref(null)

const expectedConsumptionTime = computed(() => {
	const all = mapsStore.maps.reduce((previousValue, currentValue) => {
		if (currentValue.audio)
			return previousValue + currentValue.audio.duration
		else
			return previousValue
	}, 0)

	return {
		current: mapsStore.currentMapAudio ? mapsStore.currentMapAudio.duration.toFixed(0) : 0,
		all: all.toFixed(0)
	}
})
const projectName = ref(`${accountsStore.account.nickname}的任务`)

const renameDialog = ref(false)

const loadDialog = ref(false)

const onSaveProject = async () => {
	const res = await ProjectApi.save({
		id: route.params.projectId,
		name: projectName.value,
		config: JSON.stringify(mapsStore.maps)
	})

	if (res) {
		ElNotification({
			title: '保存项目',
			message: '项目保存成功',
			type: 'success',
		})

		router.push('/editor/' + res)
	} else {
		ElNotification({
			title: '保存项目',
			message: '项目保存失败',
			type: 'warning',
		})
	}
}

const generate = async (all) => {
	generateDialogVisible.value = false

	if (all) {
		if (mapsStore.maps.findIndex(map => map.audio == null) > -1) {
			ElNotification({
				title: '警告',
				message: '确保所有场景已选择音频和背景。',
				type: 'warning',
			})
			return;
		}
	} else {
		if (mapsStore.currentMap == null || mapsStore.currentMapAudio == null) {
			ElNotification({
				title: '警告',
				message: '请选择音频和背景。',
				type: 'warning',
			})
			return;
		}
	}

	loading.value = true

	const res = await DurationApi.info()

	const useDuration = res.useDuration ? res.useDuration : 0
	const maxDuration = res.maxDuration ? res.maxDuration : 0

	const consume_time = all ? mapsStore.maps.reduce((previousValue, currentValue) => previousValue + currentValue.audio.duration, 0) : mapsStore.currentMapAudio.duration

	if ((useDuration + Number.parseInt(consume_time)) > maxDuration) {
		ElNotification({
			title: '警告',
			message: '可用生成时长不足，请申请延长时间后尝试。',
			type: 'warning',
		})
		loading.value = false;
		return;
	}

	try {
		await TaskApi.task(title.value, all ? mapsStore.maps : mapsStore.currentMap)

		router.push('/task')

		setTimeout(() => durationStore.load(), 1000)
	} catch (err) {
		ElNotification({
			title: '提示',
			message: err,
			type: 'warning',
		})
	}

	loading.value = false
}

const loadProject = async () => {
	if (route.params.projectId) {
		const res = await ProjectApi.info(route.params.projectId)

		if (res) {
			if (res.config) {
				mapsStore.maps = JSON.parse(res.config)
			}
			if (res.name) {
				projectName.value = res.name
			}
		}
	} else {
		mapsStore.maps = []
		mapsStore.currentIndex = 0
	}
}


watch(() => route.params.projectId, () => {
	if (!route.params.projectId) {
		mapsStore.maps = []
		mapsStore.currentIndex = 0
	}
})

onMounted(() => {
	if (!hintStore.notDisplayed) {
		hintStore.dialogVisible = true
	}
})

loadProject()
</script>

<style scoped>
.left {
	min-width: 300px;
}

.center {
	width: 100%;
	min-width: 500px;
	display: flex;
	flex-direction: column;
	border-left: 1px solid #eee;
	border-right: 1px solid #eee;
	margin: 0 10px;
	padding: 0 10px;
}

.center .blueprint {
	height: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
}

.right {
	min-width: 300px;
	max-width: 300px;
	display: flex;
	flex-direction: column;
}

.right .digital-human {
	height: 100%;
	height: calc(100% - 80px);
	flex-grow: revert;
}

.right .operate {
	height: 80px;
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 5px;
	justify-content: flex-end;
}

.help {
	position: absolute;
	margin-top: -65px;
	left: 250px;
}
</style>