<script setup lang="ts">
import { ref } from "vue";

interface Props {
  label: string;
  image: { data: string };
  maxSize: number;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "change", event: Event): void;
}>();

const isDragging = ref(false);

function drop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    emit("change", { target: { files: [file] } } as unknown as Event);
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center w-full bg-center bg-contain bg-no-repeat"
    :style="{
      backgroundImage: image.data ? `url('${image.data}')` : 'none',
    }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="drop"
  >
    <label
      :for="`${label}-dropzone-file`"
      class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-200 bg-opacity-40 hover:bg-gray-100 hover:bg-opacity-80"
      :class="{
        'border-blue-500 bg-gray-100 bg-opacity-80': isDragging,
      }"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <p class="mb-2 text-sm text-gray-600 dark:text-gray-700">
          <span class="font-semibold">Click to select {{ label }}</span> or drag
          and drop
        </p>
        <p class="text-xs text-gray-500">
          <span class="font-semibold">Supported formats:</span> jpg, jpeg, png
          (max {{ maxSize }} KB)
        </p>
      </div>
      <input
        :id="`${label}-dropzone-file`"
        type="file"
        accept="image/*"
        class="hidden"
        @change="($event) => emit('change', $event)"
      />
    </label>
  </div>
</template>
