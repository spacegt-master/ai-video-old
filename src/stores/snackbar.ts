import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const snackbar = ref(false);

  // success
  const type = ref();

  const title = ref();

  const text = ref();

  const timeout = ref();

  const start = (options: {
    title: string;
    type: string;
    text: string | null | undefined;
    timeout: number | null | undefined;
  }) => {
    type.value = options.type;
    title.value = options.title;
    text.value = options.text;

    timeout.value = options.timeout || 2000;
    snackbar.value = true;
  };

  return {
    snackbar,
    type,
    title,
    text,
    timeout,
    start,
  };
});

export const snackbar = (options: {
  title: string;
  type: "error" | "info" | "success" | "warning";
  text: string | null | undefined;
  timeout: number | null | undefined;
}) => {
  const snackbarStore = useSnackbarStore();
  return snackbarStore.start(options);
};
