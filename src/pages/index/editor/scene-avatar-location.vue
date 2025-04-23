<template>
	<el-dialog v-model="centerDialogVisible" title="使用其他场景中形象位置" width="500" align-center>
		<el-radio-group v-model="radio">
			<el-radio v-for="(item,index) in store.editorHistory.scenes" :value="index">场景{{index+1}}</el-radio>
		</el-radio-group>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="onSelected">
					确定
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		useGlobalStore
	} from '@/stores/global.js'

	const store = useGlobalStore()
	const centerDialogVisible = ref(false)
	const emit = defineEmits(['selected'])
	const radio = ref(0)

	const open = () => {
		centerDialogVisible.value = true
	}
	const onSelected = () => {
		emit('selected', radio.value)
		centerDialogVisible.value = false
	}

	defineExpose({
		open
	})
</script>

<style>
</style>