<template>
	<v-container class="pa-md-12" max-width="100%">
		<section>
			<h3 class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
				style="line-height: 40px;">
				任务合成进度

				<AnimatePresence>
					<Motion v-show="timer > 0" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
						:exit="{ opacity: 0 }">
						<v-progress-circular :model-value="timer"></v-progress-circular>
						<span class="ml-4 text-caption">自动加载</span>
					</Motion>
				</AnimatePresence>
			</h3>

			<div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
				显示每个任务的当前状态
			</div>

			<v-data-table class="bg-transparent" :headers="headers" hide-default-footer :items="items">
				<template #item.actions>
					<v-btn class="text-none" prepend-icon="mdi-refresh" color="primary" min-width="0" slim text="Refresh" variant="text" @click="load" />
				</template>
			</v-data-table>
		</section>
	</v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TaskApi } from '@/api/task'
import { useIntervalFn } from '@vueuse/core'
import { AnimatePresence, Motion } from 'motion-v'

const timer = ref(0)

const { pause, resume, isActive } = useIntervalFn(() => {
	timer.value += 1

	if (timer.value >= 100) {
		load()

		pause()

		timer.value = 0

		setTimeout(() => resume(), 3000)
	}
}, 50)

const headers = [
	{ title: '运行任务', key: 'task', },
	{ title: '详情', key: 'details', nowrap: true, maxWidth: '30vw' },
	{ title: '运行状态', key: 'status', },
	{ title: '状态名称', key: 'statusName', },
	{ title: '状态描述', key: 'statusDescription', },
	{ title: '开始时间', key: 'createTime', },
	{ title: '', key: 'actions', align: 'end' },
]

const items = ref([])

const load = async () => {
	items.value = await TaskApi.run()
}

onMounted(() => {
	load()
})
</script>

<style></style>