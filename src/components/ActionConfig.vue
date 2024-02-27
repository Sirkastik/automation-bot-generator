<script setup lang="ts">
defineProps<{
  selectedSubElements: Element[]
}>()
const emit = defineEmits<{
  (event: 'reset'): void
  (event: 'previous'): void
  (event: 'update:modelValue', value: string): void
  (event: 'use-parent-elements'): void
}>()

const isClickSubAction = computed(() => true)
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <header>
      <h1 class="text-xl font-bold [all:unset]">
        Step 3: Click <span v-if="isClickSubAction">a button</span>
      </h1>
    </header>
    <main class="flex-grow text-sm">
      <p v-if="!selectedSubElements.length || isClickSubAction">
        Select an element
        <span v-if="isClickSubAction">to click</span>
      </p>
      <div class="flex items-center gap-2 py-2">
        <input
          id="use-parent-elements-checkbox"
          type="checkbox"
          class="rounded"
          @input="emit('use-parent-elements')"
        />
        <label for="use-parent-elements-checkbox">
          Use selected elements for this action (you don't need to select)
        </label>
      </div>
    </main>
    <footer class="flex justify-end gap-3">
      <button
        type="button"
        class="mb-2 me-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        @click="emit('reset')"
      >
        Reset
      </button>
      <button
        type="button"
        class="mb-2 me-2 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="emit('previous')"
      >
        Save
      </button>
    </footer>
  </div>
</template>
