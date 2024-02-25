<script setup lang="ts">
const CLICK_ACTION = "click" as const;

const INPUT_ACTION = "input" as const;

const SCRAPE_ACTION = "scrape" as const;

type SubAction =
  | typeof CLICK_ACTION
  | typeof INPUT_ACTION
  | typeof SCRAPE_ACTION;

const props = defineProps<{
  selectedSubElements: Element[];
  subAction: SubAction | "";
}>();
const emit = defineEmits<{
  (event: "run-bot"): void;
  (event: "reset"): void;
  (event: "select-subaction", subaction: SubAction): void;
}>();

const isClickSubAction = computed(() => props.subAction === CLICK_ACTION);
const isInputSubAction = computed(() => props.subAction === INPUT_ACTION);
const isScrapeSubAction = computed(() => props.subAction === SCRAPE_ACTION);
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <header>
      <h1 class="font-bold">
        Step 2: Choose a child-action for each loop element
      </h1>
    </header>
    <main class="flex-grow text-sm">
      <p class="py-2">Add action you want the bot to do on the page</p>
      <div class="flex gap-4">
        <button
          type="button"
          class="hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          :class="[
            isClickSubAction
              ? 'bg-blue-800 outline-none text-white'
              : 'text-blue-700',
          ]"
          @click="emit('select-subaction', CLICK_ACTION)"
        >
          Click a button
        </button>
        <button
          type="button"
          class="hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          :class="[
            isInputSubAction
              ? 'bg-blue-800 outline-none text-white'
              : 'text-blue-700',
          ]"
          @click="emit('select-subaction', INPUT_ACTION)"
        >
          Input Text
        </button>
        <button
          type="button"
          class="hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          :class="[
            isScrapeSubAction
              ? 'bg-blue-800 outline-none text-white'
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
        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        @click="emit('reset')"
      >
        Reset
      </button>
      <button
        type="button"
        class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:ring-0 disabled:text-gray-500 disabled:border-gray-300 disabled:hover:border-gray-300 disabled:dark:bg-gray-700 disabled:dark:hover:bg-gray-700 disabled:dark:ring-0 disabled:dark:text-gray-500 disabled:dark:border-gray-600 disabled:dark:hover:border-gray-600"
        @click="emit('run-bot')"
        :disabled="!selectedSubElements.length"
      >
        Run Bot
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
