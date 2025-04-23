<template>
	<v-dialog v-model="hintStore.dialogVisible" contained max-width="600">
		<v-card rounded="lg" title="AI 视频提示">
			<template #prepend>
				<v-avatar color="success" icon="mdi-alert-box-outline" variant="tonal" />
			</template>
			<template #text>
				<div class="mb-4 text-body-2 text-medium-emphasis">
					<p>
						AI数字人是指利用人工智能技术对人脸图像进行分析和识别,以实现数字人演讲，视频数字人合成等功能。在进行AI数据人生成时,需要注意一些要点,以保证生成结果的准确性和可靠性。
					</p>
					<p>
						AI数字人需要使用高质量的人脸图像进行生成。图像的清晰度、光照、角度等因素都会影响测试的结果。因此,在进行测试前,应确保人脸图像清晰、无遮挡,并且采集的角度和光照条件尽量一致。
					</p>
					<p> 1.保证图片清晰。 </p>
					<p> 2.保持位置端正，面部处于画面中间，请勿移出图片外。 </p>
					<p> 3.保持光线正常，请勿过度曝光或太暗。 </p>
					<p> 4.保持面部整洁。 </p>
					<p> 5.保持姿势规范,请勿手部托住脸部或捂脸。 </p>
				</div>

			</template>

			<v-divider />

			<v-card-actions class="bg-surface-light">
				<v-checkbox v-model="hintStore.notDisplayed" label="不再提示" hide-details></v-checkbox>

				<v-spacer />

				<v-btn border class="text-none" color="surface" text="已知晓" variant="flat"
					@click="hintStore.dialogVisible = false" />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { useHintStore } from '@/stores/data/hint'

const hintStore = useHintStore()
</script>

<style scoped>
p {
	text-indent: 2rem;
}
</style>