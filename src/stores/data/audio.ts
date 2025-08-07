import { defineStore } from "pinia";
import { ref } from "vue";
import { AudioApi } from "@/api/audio";

export const useAudioStore = defineStore("data-audio", () => {
  const items = ref([]);

  const load = async () => {
    items.value = (await AudioApi.list()) as any;
  };

  return { items, load };
});
