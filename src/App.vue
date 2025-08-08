<template>
  <v-locale-provider locale="zhHans">
    <router-view />
  </v-locale-provider>
  <spacegt-snackbar></spacegt-snackbar>
</template>
<script setup>
import 'spacegt/dist/style.css'
import 'glightbox/dist/css/glightbox.css'
import { useAuthorizationStore, useAccountsStore, TokenApi } from 'spacegt'
import { onMounted } from 'vue'
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
