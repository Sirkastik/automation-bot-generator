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
  modelValue: string;
}>();
const emit = defineEmits<{
  (event: "reset"): void;
  (event: "previous"): void;
  (event: "update:modelValue", value: string): void;
}>();

const isClickSubAction = computed(() => props.subAction === CLICK_ACTION);
const isInputSubAction = computed(() => props.subAction === INPUT_ACTION);

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <header>
      <h1 class="text-xl font-bold">
        Step 3: Click <span v-if="isClickSubAction">a button</span>
        <span v-if="isInputSubAction">an input field</span>
      </h1>
    </header>
    <main class="flex-grow text-sm">
      <p v-if="!selectedSubElements.length || isClickSubAction">
        Select an <span v-if="isInputSubAction">input</span> element
      </p>
      <div v-if="isInputSubAction && selectedSubElements.length">
        <p class="pb-2">Enter some text</p>
        <input
          id="auto-input"
          type="text"
          placeholder="Ex: search keyword, description..."
          :value="modelValue"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          @input="onInput"
        />
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
        class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="emit('previous')"
      >
        Save
      </button>
    </footer>
  </div>
</template>
