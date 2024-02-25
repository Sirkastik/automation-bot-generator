<script setup lang="ts">
defineProps<{
  selectedElements: Element[];
  predictedParentsCount: number;
}>();

const emit = defineEmits<{
  (event: "reset"): void;
  (event: "next-step"): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <header>
      <h1 class="font-bold">Step 1: For loop</h1>
    </header>
    <main class="flex-grow text-sm">
      <p v-if="selectedElements.length < 2">Select an element</p>
      <div v-else>
        <p>
          Great! You selected 2 elements, we predicted
          {{ predictedParentsCount }} additional element{{
            predictedParentsCount > 1 ? "s" : ""
          }}
        </p>
        <p>In total, {{ selectedElements.length }} elements are selected</p>
      </div>
    </main>
    <footer class="flex justify-end gap-3">
      <button
        type="button"
        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        @click="emit('reset')"
      >
        Reset
      </button>
      <button
        type="button"
        class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:ring-0 disabled:text-gray-500 disabled:border-gray-300 disabled:hover:border-gray-300 disabled:dark:bg-gray-700 disabled:dark:hover:bg-gray-700 disabled:dark:ring-0 disabled:dark:text-gray-500 disabled:dark:border-gray-600 disabled:dark:hover:border-gray-600"
        @click="emit('next-step')"
        :disabled="!selectedElements.length"
      >
        Next
        <svg
          class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
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
