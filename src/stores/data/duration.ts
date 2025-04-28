import { DurationApi } from "@/api/duration";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { DurationCodeApi } from "@/api/duration-code.ts";

export const useDurationStore = defineStore("data-duration", () => {
  const duration = reactive({
    useDuration: 0,
    maxDuration: 0,
  });

  const load = async () => {
    const res = (await DurationApi.info()) as any;
    if (res) {
      duration.useDuration = res.useDuration;
      duration.maxDuration = res.maxDuration;
    }
  };

  const useDurationCode = () => {
    ElMessageBox.prompt("请输入兑换码", "使用兑换码", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(async ({ value }) => {
        if (!value) {
          ElMessageBox.alert("兑换码不得为空", "提示", { type: "warning" });
        } else {
          try {
            await DurationCodeApi.use(value).then(() => load());

            load();

            const durationCodeStore = useDurationCodeStore();

            durationCodeStore.load();
          } catch (e: any) {
            ElNotification({
              title: "提示",
              message: `${e.response.data.message}(code:${e.response.data.code})`,
              type: "warning",
            });
          }
        }
      })
      .catch(() => {});
  };

  return { duration, load, useDurationCode };
});

export const useDurationCodeStore = defineStore("data-duration-code", () => {
  const dialog = ref(false);
  const items = ref([]);
  const used = ref(false);
  const duration = ref(60);

  const generateCode = async () => {
    dialog.value = false;

    DurationCodeApi.generate(duration.value).then(() => load());
  };
  const removeCode = async (id: string) => {
    await DurationCodeApi.del(id);

    load();
  };

  const load = async () => {
    const res = (await DurationCodeApi.list()) as any;

    items.value = res.filter((item: any) => item.isValid == 0 || used.value);
  };

  return { dialog, items, used, duration, generateCode, removeCode, load };
});
