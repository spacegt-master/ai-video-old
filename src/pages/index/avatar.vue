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
						@click="mapsStore.setCurrentMapAvatar(item)">
						<v-img :aspect-ratio="4 / 5" block cover :src="item.uri" />

						<v-overlay class="align-center justify-center" contained :model-value="isHovering" persistent
							scrim="surface" />
					</v-card>
				</v-hover>

				<p class="text-body-2 text-medium-emphasis mt-3">{{ item.voiceName }}</p>
				<p class="font-weight-bold text-body-1"> {{ item.name }}</p>
			</v-col>
		</v-row>
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
import { useAccountsStore } from '@/stores/data/accounts'
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

const loadAvatars = async () => {
	items.value = await list(accountsStore.account.id)
}

onMounted(() => {
	loadAvatars()
	setTimeout(() => GLightbox(), 300)
})
</script>
<style></style>