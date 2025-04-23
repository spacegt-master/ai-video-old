import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";

export const useAuthorizationStore = defineStore(
  "authorization",
  () => {
    const head = ref("Authorization");
    const prefix = ref("Bearer");
    const token = ref("");

    const getFullToken = computed(() => `${prefix.value} ${token.value}`);

    return { head, prefix, token, getFullToken };
  },
  {
    persist: true,
  }
);
