<script setup lang="ts">
const CLICK_ACTION = 'click' as const

const INPUT_ACTION = 'input' as const

const SCRAPE_ACTION = 'scrape' as const

type SubAction =
  | typeof CLICK_ACTION
  | typeof INPUT_ACTION
  | typeof SCRAPE_ACTION

const props = defineProps<{
  selectedSubElements: Element[]
  subAction: SubAction | ''
}>()
const emit = defineEmits<{
  (event: 'run-bot'): void
  (event: 'reset'): void
  (event: 'select-subaction', subaction: SubAction): void
}>()

const isClickSubAction = computed(() => props.subAction === CLICK_ACTION)
const isInputSubAction = computed(() => props.subAction === INPUT_ACTION)
const isScrapeSubAction = computed(() => props.subAction === SCRAPE_ACTION)
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <header>
      <h1 class="text-xl font-bold [all:unset]">
        Step 2: Choose a child-action for each loop element
      </h1>
    </header>
    <main class="flex-grow text-sm">
      <p class="py-2">Add action you want the bot to do on the page</p>
      <div class="flex gap-4">
        <button
          type="button"
          class="mb-2 me-2 rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
          :class="[
            isClickSubAction
              ? 'bg-blue-800 text-white outline-none'
              : 'text-blue-700',
          ]"
          @click="emit('select-subaction', CLICK_ACTION)"
        >
          Click a button
        </button>
        <button
          type="button"
          class="mb-2 me-2 rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
          :class="[
            isInputSubAction
              ? 'bg-blue-800 text-white outline-none'
              : 'text-blue-700',
          ]"
          @click="emit('select-subaction', INPUT_ACTION)"
        >
          Input Text
        </button>
        <button
          type="button"
          class="mb-2 me-2 rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
          :class="[
            isScrapeSubAction
              ? 'bg-blue-800 text-white outline-none'
              : 'text-blue-700',
          ]"
          @click="emit('select-subaction', SCRAPE_ACTION)"
        >
          Scrape Data
        </button>
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
        @click="emit('run-bot')"
        :disabled="!selectedSubElements.length"
      >
        Run Bot
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
