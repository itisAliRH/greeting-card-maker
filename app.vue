<script setup lang="ts">
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import { useLocalStorage, watchDebounced } from "@vueuse/core";
import satori from "satori";
import { html } from "satori-html";
import ChristmasCard from "./components/ChristmasCard.vue";

type Font = { name: string; url: string; data?: ArrayBuffer };

type SatoriFontOptions = {
  name: string;
  data: ArrayBuffer;
};

const defaultForm = {
  name: "Santa Claus",
  greeting: "Merry Christmas",
  background: {
    data: "/img/background.jpg",
    name: "Christmas Gifts Red Table",
  },
  avatar: {
    data: "/img/avatar.png",
    name: "Santa Claus",
  },
};

const form = useLocalStorage("greeting-card-form", defaultForm);

const svg = ref("");
const fonts = ref<Font[]>([]);

function resetForm() {
  form.value = defaultForm;
}

async function loadFonts(fonts: Font[]) {
  return Promise.all(
    fonts.map(async (font) => ({
      ...font,
      data: await (await fetch(font.url)).arrayBuffer(),
    }))
  );
}

async function refreshGraphics() {
  const content = await renderToHTML(ChristmasCard, form.value);
  const markup = html(content);
  svg.value = await satori(markup, {
    width: 1080,
    height: 1080,
    fonts: fonts.value as SatoriFontOptions[],
  });
}

async function handleAvatarChange(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file && file.size > 100 * 1024)
    throw new Error("File size must be below 100kb");
  const reader = new FileReader();
  reader.onload = () =>
    (form.value.avatar = {
      data: reader.result as string,
      name: file?.name || "Custom avatar",
    });
  if (file) reader.readAsDataURL(file);
}

async function handleBackgroundChange(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file && file.size > 3000 * 1024)
    throw new Error("File size must be below 5mb");
  const reader = new FileReader();
  reader.onload = () =>
    (form.value.background = {
      data: reader.result as string,
      name: file?.name || "Custom background",
    });
  if (file) reader.readAsDataURL(file);
}

async function renderToHTML(Component: any, props = {}) {
  return await renderToString(createSSRApp(Component, props));
}

function downloadSvgAsJpeg(svgString: string, filename = "image.jpeg") {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1080;
    canvas.getContext("2d")?.drawImage(img, 0, 0, 1080, 1080);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg");
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

watchDebounced(form, refreshGraphics, {
  deep: true,
  debounce: 500,
  maxWait: 1000,
});

onMounted(async () => {
  fonts.value = await loadFonts([
    { name: "InstrumentSans", url: "/fonts/InstrumentSans-Regular.ttf" },
  ]);

  refreshGraphics();
});
</script>

<template>
  <div
    class="flex justify-center h-auto min-h-screen bg-gray-100 py-5 md:py-20 w-full"
  >
    <div
      class="border px-4 py-3 md:px-8 md:py-8 w-auto bg-white gap-8 border-gray-200 rounded-lg flex flex-col items-center mx-3 justify-between"
    >
      <div class="w-full text-2xl font-medium text-center">
        <h1>
          Greeting card maker
          <hr class="w-full border-gray-200 mt-4 md:mt-8" />
        </h1>
      </div>
      <div
        class="flex flex-col gap-0 w-full md:flex-row md:gap-8 content-center flex-nowrap items-center"
      >
        <div class="md:w-1/3 w-full min-w-1/3">
          <div class="preview-card" v-html="svg" />
        </div>
        <form class="flex flex-col gap-4 md:w-2/3 w-full">
          <label class="text-sm text-gray-500" for="name">Your name</label>
          <input
            id="name"
            type="text"
            v-model="form.name"
            class="px-4 py-1 border w-full rounded-lg"
            placeholder="Enter name"
          />
          <label class="text-sm text-gray-500" for="greeting">
            Greeting message
          </label>
          <input
            id="greeting"
            type="text"
            v-model="form.greeting"
            class="px-4 py-1 border w-full rounded-lg"
            placeholder="Enter greeting"
          />
          <div class="flex flex-col md:flex-row gap-4">
            <ImageSelector
              id="avatar"
              label="Avatar"
              :max-size="100"
              :image="form.avatar"
              @change="handleAvatarChange"
            />
            <ImageSelector
              id="background"
              label="Background"
              :max-size="3000"
              :image="form.background"
              @change="handleBackgroundChange"
            />
          </div>
          <div class="flex flex-row gap-4 justify-center">
            <button
              class="border border-indigo-500 text-black px-4 py-2 rounded-lg hover:bg-indigo-700 hover:text-white"
              @click.prevent="resetForm"
            >
              Reset form
            </button>
            <button
              class="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              @click.prevent="downloadSvgAsJpeg(svg)"
            >
              Download
            </button>
          </div>
        </form>
      </div>
      <span class="text-xs text-gray-500 mt-4">
        Made with ❤️ by
        <a
          class="text-blue-500 hover:text-blue-700"
          href="https://github.com/itisalirh"
          target="_blank"
        >
          @itisAliRH
        </a>
      </span>
    </div>
  </div>
</template>

<style>
.preview-card svg {
  width: 100%;
  height: 100%;
}
</style>
