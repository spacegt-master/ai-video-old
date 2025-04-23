import { useWebNotification } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { v4 as uuidv4 } from "uuid";

const { isSupported, permissionGranted, show } = useWebNotification();

export interface Map {
  id: string;
  name: string;
  bgUri: string;
  avatar: Avatar | null;
  audio: Audio | null;
  location: MapLocation;
}

export interface MapLocation {
  original_width: number;
  original_height: number;
  width: number;
  height: number;
  scale: number;
}

export interface Audio {
  id: string;
  name: string;
  duration: number;
  uri: string;
  config: string;
}

export interface Avatar {
  id: string;
  name: string;
  uri: string;
  voice: string;
  voiceName: string;
  location: AvatarLocation;
}

export interface AvatarLocation {
  original_width: number;
  original_height: number;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
}

const maps = ref<Map[]>([]);

const currentIndex = ref(0);

const currentMap = computed(() => {
  if (maps.value.length > 0) return maps.value[currentIndex.value];
  else return null;
});

const currentMapLocation = computed(() => {
  if (currentMap.value) return currentMap.value.location;
  else return null;
});

const currentMapAudio = computed(() => {
  if (currentMap.value) {
    return currentMap.value.audio;
  } else return null;
});

const currentMapAvatar = computed(() => {
  if (currentMap.value) {
    return currentMap.value.avatar;
  } else return null;
});

const currentMapAvatarLocation = computed(() => {
  if (currentMap.value && currentMap.value.avatar) {
    return currentMap.value.avatar.location;
  } else return null;
});

const addMap = async ({ id, name, bgUri }: any) => {
  const pictureSize = (await getPictureSize(bgUri)) as any;

  maps.value.push({
    id: id || uuidv4(),
    name: name || uuidv4(),
    bgUri: bgUri,
    avatar: null,
    audio: null,
    location: {
      original_width: pictureSize.width,
      original_height: pictureSize.height,
      width: pictureSize.width,
      height: pictureSize.height,
      scale: 1,
    },
  });
};

const setCurrentMapLocation = (data: MapLocation) => {
  if (currentMap.value) currentMap.value.location = data;
};

const setCurrentMapAudio = (data: Audio) => {
  if (currentMap.value) currentMap.value.audio = data;
};

const setCurrentMapAvatar = async (data: Avatar) => {
  if (currentMap.value) {
    const pictureSize = (await getPictureSize(data.uri)) as any;

    currentMap.value.avatar = {
      ...data,
      location: {
        original_width: pictureSize.width,
        original_height: pictureSize.height,
        width: pictureSize.width,
        height: pictureSize.height,
        x: 0,
        y: 0,
        scale: 1,
      },
    };
  }
};

const setCurrentMapAvatarLocation = (data: AvatarLocation) => {
  if (currentMap.value && currentMap.value.avatar)
    currentMap.value.avatar.location = data;
};

const setCurrentIndex = (index: number) => {
  currentIndex.value = index;
};

const moveUp = (index: number) => {
  if (index == 0) {
    show({
      title: "已经是顶部",
      icon: "/favicon.png",
      renotify: true,
      tag: uuidv4(),
    });
    return;
  }

  const temp = maps.value[index];
  maps.value[index] = maps.value[index - 1];
  maps.value[index - 1] = temp;
};

const moveDown = (index: number) => {
  if (index === maps.value.length - 1) {
    show({
      title: "已经是底部",
      icon: "/favicon.png",
      renotify: true,
      tag: uuidv4(),
    });
    return;
  }

  const temp = maps.value[index + 1];
  maps.value[index + 1] = maps.value[index];
  maps.value[index] = temp;
};

const delMap = async (index: number) => {
  const activeIndex = currentIndex.value;

  if (activeIndex == index && index > 0) {
    setCurrentIndex(activeIndex - 1);
  } else if (activeIndex > index) {
    setCurrentIndex(activeIndex - 1);
  }

  maps.value.splice(index, 1);
};

const clearMaps = () => {
  maps.value = [];
  setCurrentIndex(0);
};

const delAvatar = (index: number | null) => {
  if (index) {
    maps.value[index].avatar = null;
  } else {
    if (currentMap.value) currentMap.value.avatar = null;
  }
};

const precision = (number: number) => {
  return Number(number.toFixed(4));
};

const getPictureSize = (uri: string) => {
  let imgObj = new Image();
  imgObj.src = uri;

  return new Promise((resove, reject) => {
    imgObj.onload = function () {
      resove({ width: imgObj.width, height: imgObj.height });
    };
  });
};

export const useMapsStore = defineStore(
  "data-maps",
  () => {
    return {
      maps,
      currentIndex,
      currentMap,
      currentMapLocation,
      currentMapAudio,
      currentMapAvatar,
      currentMapAvatarLocation,
      addMap,
      setCurrentMapLocation,
      setCurrentMapAudio,
      setCurrentMapAvatar,
      setCurrentMapAvatarLocation,
      setCurrentIndex,
      moveUp,
      moveDown,
      delMap,
      clearMaps,
      delAvatar,
      precision,
      getPictureSize,
    };
  },
  {
    persist: true,
  }
);
