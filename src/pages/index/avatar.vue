<template>
	<v-container v-if="component" fluid>
		<v-responsive max-width="800">
			<p class="font-weight-bold text-h5">
				我的形象
			</p>
		</v-responsive>

		<v-row class="mt-4">
			<v-col v-for="(item, i) in items" :key="i" cols="12">
				<v-hover v-slot="{ isHovering, props: hoverProps }">
					<v-card class="mx-auto" flat link :ripple="false" rounded="lg" v-bind="hoverProps"
						@click="onSelectedAvatar(item)">
						<v-img :aspect-ratio="4 / 5" block cover :src="item.uri" />

						<v-overlay class="align-center justify-center" contained :model-value="isHovering" persistent
							scrim="surface" />
					</v-card>
				</v-hover>

				<p class="text-body-2 text-medium-emphasis mt-3">{{ item.voiceName }}</p>
				<p class="font-weight-bold text-body-1"> {{ item.name }}</p>
			</v-col>
		</v-row>

		<v-dialog v-model="selectedPromptDrawer" contained max-width="500">
			<v-card rounded="lg" title="更换形象">
				<template #prepend>
					<v-avatar color="info" icon="mdi-account-arrow-left-outline" variant="tonal" />
				</template>

				<template #text>
					<div class="mb-4 text-body-2 text-medium-emphasis">
						是否更换新的形象。
					</div>

				</template>

				<v-divider />

				<v-card-actions class="bg-surface-light">
					<v-spacer />

					<v-btn border class="text-none" color="surface" text="取消" variant="flat"
						@click="selectedPromptDrawer = false" />

					<v-btn class="text-none" color="info" text="确定" variant="flat"
						@click="onSelectedAvatarConfirm" />
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>

	<v-container v-else class="pa-6 pa-md-12" max-width="1600px" fluid>
		<v-responsive max-width="800">
			<p class="font-weight-bold text-h4">
				我的形象
			</p>

			<p class="mt-2 text-subtitle-1 text-medium-emphasis">
				您的形象将用于什么场合？是正式的商务会议、轻松的社交聚会、个人网站、简历、还是社交媒体简介？不同的场合需要不同的风格和侧重点。
			</p>
		</v-responsive>

		<v-row class="mt-4">
			<v-col v-for="(item, i) in items" :key="i" cols="12" md="3" sm="6">
				<v-hover v-slot="{ isHovering, props: hoverProps }">
					<a :href="item.uri" class="glightbox">
						<v-card class="mx-auto" flat link :ripple="false" rounded="lg" v-bind="hoverProps">
							<v-img :aspect-ratio="4 / 5" block cover :src="item.uri" />

							<v-overlay class="align-center justify-center" contained :model-value="isHovering"
								persistent scrim="surface" />
						</v-card>
					</a>
				</v-hover>

				<p class="text-body-2 text-medium-emphasis mt-3">{{ item.voiceName }}</p>
				<p class="font-weight-bold text-body-1"> {{ item.name }}</p>
			</v-col>
		</v-row>

	</v-container>
</template>

<script setup>
import GLightbox from 'glightbox';
import { ref, onMounted } from 'vue'
import { list } from '@/api/avatar.js'
import { useAccountsStore } from 'spacegt'
import { useMapsStore } from '@/stores/data/maps';

const mapsStore = useMapsStore()
const accountsStore = useAccountsStore()
const emit = defineEmits(['selected'])
const props = defineProps({
	component: {
		type: Boolean,
		default: false
	}
})
const items = ref([])

const selectedItem = ref()

const selectedPromptDrawer = ref(false)

const onSelectedAvatar = (item) => {
	if (mapsStore.currentMapAvatar != null) {
		selectedPromptDrawer.value = true

		selectedItem.value = item
	} else {
		mapsStore.setCurrentMapAvatar(item)
	}
}

const onSelectedAvatarConfirm = () => {
	mapsStore.setCurrentMapAvatar()

	mapsStore.setCurrentMapAvatar(selectedItem.value)

	selectedPromptDrawer.value = false
}

const loadAvatars = async () => {
	items.value = await list(accountsStore.account.id)
}

onMounted(() => {
	loadAvatars()
	setTimeout(() => GLightbox(), 300)
})
</script>
<style></style>