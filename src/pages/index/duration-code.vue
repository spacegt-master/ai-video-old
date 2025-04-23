<template>
	<v-container class="pa-6 pa-md-12" fluid>
		<v-responsive max-width="100%">
			<div class="d-flex justify-space-between align-center mb-4 flex-wrap ">
				<p class="font-weight-bold text-h4 ">
					兑换码
				</p>
				<v-btn class="text-none px-0" color="primary" :ripple="false" size="small" text="生成兑换码" variant="plain"
					@click="durationCodeStore.dialog = true" />
			</div>
			<v-checkbox v-model="durationCodeStore.used" label="显示已用兑换码" @change="durationCodeStore.load"></v-checkbox>
		</v-responsive>
		<v-container class="pa-md-12" max-width="100%">
			<v-row>
				<v-col v-for="(item, i) in durationCodeStore.items" :key="i" cols="12" xl="4" lg="6">
					<v-card class="d-flex">
						<v-avatar :color="item.isValid ? 'pink' : 'cyan-darken-1'" rounded="s e-0" size="56"
							:text="item.isValid ? '失效' : '有效'" />

						<v-list-item :subtitle="`兑换时长 ${item.duration} s`" :title="item.code" />

						<v-btn class="ms-auto me-2 mt-2" color="disabled" density="comfortable" icon="mdi-delete"
							variant="text" @click="durationCodeStore.removeCode(item.id)" />
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-container>
	<v-dialog v-model="durationCodeStore.dialog" width="auto">
		<v-card width="500" prepend-icon="mdi-code-string" text="请输入兑换码的时长（秒）" title="生成兑换码">
			<template #default>
				<div class="px-6">
					<v-text-field v-model="durationCodeStore.duration" type="number" label="时长（秒）" variant="solo"
						@keyup.enter="durationCodeStore.generateCode"></v-text-field>
				</div>
			</template>
			<template v-slot:actions>
				<v-btn class="ms-auto" text="Ok" :disabled="durationCodeStore.duration < 1"
					@click="durationCodeStore.generateCode"></v-btn>
			</template>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { useDurationCodeStore } from '@/stores/data/duration'
import { onMounted } from 'vue'

const durationCodeStore = useDurationCodeStore()

onMounted(() => durationCodeStore.load())
</script>

<style></style>