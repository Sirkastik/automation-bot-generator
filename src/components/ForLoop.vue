<script setup lang="ts">
defineProps<{
  selectedElements: Element[]
  predictedParentsCount: number
}>()

const emit = defineEmits<{
  (event: 'reset'): void
  (event: 'next-step'): void
}>()
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <header class="inspector_page__header">Step 1: For loop</header>
    <main class="flex-grow text-sm">
      <p v-if="selectedElements.length < 2">Select an element</p>
      <div v-else>
        <p>
          Great! You selected 2 elements, we predicted
          {{ predictedParentsCount }} additional element{{
            predictedParentsCount > 1 ? 's' : ''
          }}
        </p>
        <p>In total, {{ selectedElements.length }} elements are selected</p>
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
        class="mb-2 me-2 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:ring-0 disabled:hover:border-gray-300 disabled:hover:bg-gray-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:dark:border-gray-600 disabled:dark:bg-gray-700 disabled:dark:text-gray-500 disabled:dark:ring-0 disabled:dark:hover:border-gray-600 disabled:dark:hover:bg-gray-700"
        @click="emit('next-step')"
        :disabled="!selectedElements.length"
      >
        Next
        <svg
          class="ms-2 h-3.5 w-3.5 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </footer>
  </div>
</template>

<style lang="css">
.inspector_page__header {
  all: unset;
  @apply text-xl font-bold;
}
</style>
