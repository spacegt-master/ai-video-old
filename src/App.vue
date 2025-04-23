<template>
  <router-view />
</template>
<script setup>
import 'spacegt/dist/style.css'
import 'glightbox/dist/css/glightbox.css'
import { useAuthorizationStore } from '@/stores/authorization'
import { TokenApi } from '@/api/accounts/token'
import { onMounted } from 'vue'
import { useAccountsStore } from '@/stores/data/accounts'
import { useRouter } from 'vue-router'

const authorizationStore = useAuthorizationStore()
const accountsStore = useAccountsStore()
const router = useRouter()

onMounted(async () => {
  if (authorizationStore.token) {
    const res = await TokenApi.validate(authorizationStore.token)

    if (!res) {
      accountsStore.account = null
      accountsStore.authorities = []

      authorizationStore.token = ''

      router.push('/login')
    }
  } else {
    accountsStore.account = null
    accountsStore.authorities = []

    authorizationStore.token = ''

    router.push('/login')
  }
}) 
</script>
<style>
html {
  overflow: hidden;
}

html,
body,
#app {
  height: 100%;
}
</style>
