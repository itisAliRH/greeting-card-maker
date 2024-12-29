<script setup lang="ts">
interface Props {
  name: string;
  greeting: string;
  avatar: { data: string };
  background: { data: string };
}

defineProps<Props>();
</script>

<template>
  <div
    class="w-full h-full flex flex-col text-white text-7xl font-bold p-10 items-center justify-center bg-center bg-contain bg-no-repeat"
    :style="
      background
        ? {
            backgroundImage: `url(${background.data})`,
          }
        : {}
    "
  >
    <div class="font-bold mb-8" style="font-size: 100px">{{ greeting }}</div>
    <img
      v-if="avatar.data"
      :src="avatar.data"
      width="400"
      height="400"
      class="rounded-full border-2 border-red-800 mb-8 backdrop-opacity-30 backdrop-invert bg-white/70"
      style="width: 400px; height: 400px"
    />
    <div class="bg-red-400 px-2 py-2 mb-2 rounded-xl">From</div>
    <div class="shadow-2xl rounded-xl">
      {{ name || "Add your name here" }}
    </div>
    <span class="text-xs text-black-300 mt-4">
      Made with love by @itisAliRH
    </span>
  </div>
</template>
