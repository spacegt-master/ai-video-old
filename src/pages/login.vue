<template>
  <spacegt-login :proxy="proxy" locale="zhHans"  @login="onLogin">
  </spacegt-login>
</template>

<script setup>
import { snackbar } from '@/stores/snackbar';
import { useRouter } from 'vue-router';
import { useAuthorizationStore } from '@/stores/authorization'
import { useAccountsStore } from '@/stores/data/accounts'

const authorizationStore = useAuthorizationStore()
const accountsStore = useAccountsStore()
const router = useRouter()

const proxy = import.meta.env.VITE_APP_ACCOUNTS_SERVICE

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