<template>
  <spacegt-login :sso="ssoProxy" locale="zhHans" @login="onLogin">
  </spacegt-login>
</template>

<script setup>
import { snackbar } from '@/stores/snackbar';
import { useRouter } from 'vue-router';
import { useAuthorizationStore, useAccountsStore } from 'spacegt'
import { accountsServiceConfig } from 'spacegt';

accountsServiceConfig.baseURL = import.meta.env.VITE_APP_ACCOUNTS_SERVICE

const ssoProxy = import.meta.env.VITE_APP_ACCOUNTS_SSO_SERVICE

const authorizationStore = useAuthorizationStore()
const accountsStore = useAccountsStore()
const router = useRouter()

const onLogin = (data) => {
  if (data.code === 0) {
    authorizationStore.token = data.token
    accountsStore.account = data.data
    accountsStore.authorities = data.data.authorities
    router.push('/')
  } else {
    snackbar({
      title: data.message,
      type: 'warning',
    })
  }
}
</script>

<style lang="scss" scoped></style>