import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  persist: {
    enabled: true, //开启数据持久化
    strategies: [
      {
        key: "global", //给一个要保存的名称
        storage: localStorage, //sessionStorage / localStorage 存储方式
      },
    ],
  },
  state: () => ({
    token: null,
    org: null,
    authorities: [],
    editorHintDisable: false,
    editorHistory: {
      id: null, // project_id : 项目id
      name: "",
      sceneIndex: -1,
      scenes: [], // { dlueprint scene copywriter }
      options: {
        // 全局配置选项
        eye: "",
        tailor: true,
        show_subtitle: false,
      },
    },
    platform: "yigee", //moying
    platformUrl: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setOrg(orgId) {
      this.org = orgId;
    },
    setPlatform(pingtai) {
      this.platform = pingtai;
    },
    setPlatformUrl(url) {
      this.platformUrl = url;
    },
    setAuthorities(auth) {
      if (auth) {
        this.authorities = auth.split(",");
      } else {
        this.authorities = [];
      }
    },
    initEditorHistoryScene() {
      this.editorHistory.id = null;
      this.editorHistory.name = "";
      this.editorHistory.sceneIndex = -1;
      this.editorHistory.scenes = [];
    },
    addEditorHistoryScene(scene) {
      this.editorHistory.scenes.push({
        scene,
        blueprint: null,
        copywriter: null,
        avatar: null,
        step: [],
      });
    },
    insertEditorHistoryScene(index, scene) {
      this.editorHistory.scenes.splice(index, 0, {
        scene,
        blueprint: null,
        copywriter: null,
        avatar: null,
        step: [],
      });
    },
    addEditorHistorySceneBlueprint(index, blueprint) {
      if (this.editorHistory.scenes[index]) {
        this.editorHistory.scenes[index].blueprint = blueprint;
      }
    },
    addEditorHistorySceneStep(index, blueprint) {
      if (
        this.editorHistory.scenes[index] &&
        this.editorHistory.scenes[index].step
      ) {
        this.editorHistory.scenes[index].step.push(blueprint);
      } else {
        this.editorHistory.scenes[index].step = [blueprint];
      }
    },
    addEditorHistorySceneCopywriter(index, copywriter) {
      if (this.editorHistory.scenes[index]) {
        this.editorHistory.scenes[index].copywriter = copywriter;
      }
    },
    addEditorHistorySceneAvatar(index, avatar) {
      if (this.editorHistory.scenes[index]) {
        this.editorHistory.scenes[index].avatar = avatar;
      }
    },
    delEditorHistoryScene(index) {
      this.editorHistory.scenes.splice(index, 1);
      this.editorHistory.sceneIndex = this.editorHistory.scenes.length - 1;
    },
    delAllEditorHistoryScene() {
      this.editorHistory.sceneIndex = -1;
      this.editorHistory.scenes = [];
    },
    delAvatar() {
      if (this.editorHistory.scenes[this.editorHistory.sceneIndex]) {
        this.editorHistory.scenes[this.editorHistory.sceneIndex].avatar = null;
      }
    },
  },
});
