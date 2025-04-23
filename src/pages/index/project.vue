<template>
	<v-container class="pa-md-12" max-width="100%">
		<section>
			<h3 class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
				style="line-height: 40px;">
				保存的项目
			</h3>

			<div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
				创作中的项目保存在这里
			</div>

			<v-data-table class="bg-transparent" :headers="headers" hide-default-footer :items="items">
				<template #item.actions="{ item }">
					<v-btn class="text-none" prepend-icon="mdi-import" color="primary" min-width="0" slim text="Import"
						variant="text" :to="`/editor/${item.id}`" />
				</template>
			</v-data-table>
		</section>
	</v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ProjectApi } from '@/api/project'

const headers = [
	{ title: '项目名称', key: 'name', },
	{ title: '配置', key: 'config', nowrap: true, maxWidth: '30vw' },
	{ title: '创建时间', key: 'createTime', },
	{ title: '修改时间', key: 'updateTime', },
	{ title: '', key: 'actions', align: 'end' },
]

const items = ref([])

const load = async () => {
	items.value = await ProjectApi.list()
}

onMounted(() => {
	load()
})
</script>

<style></style>