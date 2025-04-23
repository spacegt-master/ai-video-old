import { defineStore } from "pinia";
import { ref } from "vue";

export const useHintStore = defineStore(
  "data-hint",
  () => {
    const notDisplayed = ref(false);

    const dialogVisible = ref(false);

    return { notDisplayed, dialogVisible };
  },
  {
    persist: true,
  }
);
