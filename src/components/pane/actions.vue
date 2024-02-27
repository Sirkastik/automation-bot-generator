<script setup lang="ts">
enum Actions {
  Input,
  Scrape,
  Click,
}

const emit = defineEmits<{
  (event: 'choose-action', action: Actions): void
  (event: 'proceed'): void
}>()

function choose(action: Actions) {
  emit('choose-action', action)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <SectionHeader>
      <IconsCogs class="text-2xl" />
      Select Action
    </SectionHeader>

    <span class="py-2"
      >Please select an action to apply on the selected elements:</span
    >
    <div class="flex gap-4 py-2">
      <ActionButton @click="choose(Actions.Input)">
        Input
        <IconsInput />
      </ActionButton>
      <ActionButton @click="choose(Actions.Scrape)">
        Scrape
        <IconsData />
      </ActionButton>
      <ActionButton @click="choose(Actions.Click)">
        Click
        <IconsClick />
      </ActionButton>
    </div>
    <footer class="mt-auto flex justify-end gap-3">
      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100"
      >
        Reset
      </button>
      <button
        type="button"
        class="flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:ring-0 disabled:hover:border-gray-300 disabled:hover:bg-gray-300"
        @click="emit('proceed')"
      >
        Proceed
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
