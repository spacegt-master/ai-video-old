<template>
	<v-app>
		<v-app-bar border="b" class="ps-4" flat>
			<template #default>
				<div style="display: flex; align-self: center;font-size: 18px;font-weight: 700; align-items: center;"
					@click="isCollapse = !isCollapse">
					<v-img src="/favicon.png" width="60px" height="60px" class="ml-8"
						style="filter: brightness(0.3);"></v-img>
				</div>
			</template>

			<template #append>
				<div style="display: flex; align-items: center;margin-right: 10px;">
					<el-progress v-if="durationStore.duration.maxDuration > 0"
						:percentage="durationStore.duration.useDuration / durationStore.duration.maxDuration * 100"
						:stroke-width="35" :text-inside="true" style="width: 200px;">
						<span class="ml-2" style=" filter: drop-shadow(1px 2px 4px #333);">
							已用AI生成时长 (
							{{ durationStore.duration.useDuration }}
							/
							{{ durationStore.duration.maxDuration == 999999999 ? '∞' :
								durationStore.duration.maxDuration }}
							) 秒
						</span>
					</el-progress>
					<v-btn class="mx-2" variant="text" v-if="durationStore.duration.maxDuration != 999999999"
						@click="durationStore.useDurationCode">
						兑换时长
					</v-btn>
				</div>
				<spacegt-myaccount :sso="ssoProxy" :enabled-settings="false" :account="accountsStore.account"
					@logout="handleLogout" @login="handleLogin">
				</spacegt-myaccount>
			</template>
		</v-app-bar>
		<v-navigation-drawer>
			<v-list density="compact" item-props nav>
				<v-list-item to="/editor">
					<template v-slot:prepend>
						<v-icon>
							<Platform />
						</v-icon>
					</template>

					<v-list-item-title>创作空间</v-list-item-title>
				</v-list-item>

				<v-list-item to="/audio">
					<template v-slot:prepend>
						<v-icon>
							<Microphone />
						</v-icon>
					</template>

					<v-list-item-title>我的声音</v-list-item-title>
				</v-list-item>

				<v-list-item to="/avatar">
					<template v-slot:prepend>
						<v-icon>
							<Picture />
						</v-icon>
					</template>

					<v-list-item-title>我的分身</v-list-item-title>
				</v-list-item>

				<v-list-item to="/video">
					<template v-slot:prepend>
						<v-icon>
							<VideoCamera />
						</v-icon>
					</template>

					<v-list-item-title>我的微课</v-list-item-title>
				</v-list-item>

				<v-list-item to="/duration-code" v-if="accountsStore.hasAuthority('ROLE_ADMIN')">
					<template v-slot:prepend>
						<v-icon>
							<Ticket />
						</v-icon>
					</template>

					<v-list-item-title>兑换码管理</v-list-item-title>
				</v-list-item>

				<v-list-item to="/project">
					<template v-slot:prepend>
						<v-icon>
							<Notebook />
						</v-icon>
					</template>

					<v-list-item-title>项目管理</v-list-item-title>
				</v-list-item>

				<v-list-item to="/task">
					<template v-slot:prepend>
						<v-icon>
							<ScaleToOriginal />
						</v-icon>
					</template>

					<v-list-item-title>任务合成进度</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main class="overflow-y-auto h-100">
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDurationStore } from '@/stores/data/duration'
import { useRouter } from 'vue-router'
import { useAccountsStore, useAuthorizationStore } from 'spacegt'

const ssoProxy = String(import.meta.env.VITE_APP_ACCOUNTS_SSO_SERVICE)

const accountsStore = useAccountsStore()
const authorizationStore = useAuthorizationStore()
const router = useRouter()
const durationStore = useDurationStore()
const isCollapse = ref(false)

const handleLogout = () => {
	console.log(accountsStore)
	accountsStore.account = undefined
	accountsStore.authorities = []
	authorizationStore.token = ''

	// nextTick(() => router.push('/login'))
}

const handleLogin = () => {
	router.push('/login')
}

onMounted(() => durationStore.load())
</script>

<style scoped>
.el-container {
	height: 100%;
}

.el-header {
	height: 65px;
	padding: 0px 16px;
	display: flex;
	gap: 12px;
	justify-content: space-between;
	background: linear-gradient(90.11deg, rgb(255, 255, 255) 0%, rgb(249, 249, 249) 100%);
	border-bottom: 1px solid rgba(35, 40, 51, 0.1);
}

.el-avatar {
	border: 2px solid #fff;
	transition: all 0.2s;
}

.el-avatar:hover {
	border: 2px solid var(--el-color-primary);
}

.avatar-btn .el-avatar {
	width: 46px;
	height: 46px;
}
</style>