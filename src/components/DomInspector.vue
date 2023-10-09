<script setup lang="ts">
import { ref, onMounted, shallowRef, computed } from "vue";

const USER_SELECTED_CLASSNAME = "--user-selected";

const ALGO_SELECTED_CLASSNAME = "--algo-selected";

const DASHED_CLASSNAME = "--dashed";

const DARK_CLASSNAME = "--dark";

const RESERVED_CLASSNAMES = [
  USER_SELECTED_CLASSNAME,
  ALGO_SELECTED_CLASSNAME,
  DASHED_CLASSNAME,
  DARK_CLASSNAME,
];

const CLICK_ACTION = "click" as const;

const INPUT_ACTION = "input" as const;

const SCRAPE_ACTION = "scrape" as const;

const KEY_IGNORE = "inspector-ignore";

type SubAction =
  | typeof CLICK_ACTION
  | typeof INPUT_ACTION
  | typeof SCRAPE_ACTION;

const step = ref<1 | 2 | 3>(1);

const subAction = ref<SubAction | "">("");

const inputValue = ref("");

const enableInspector = ref(true);
const showOverlay = ref(true);

const x = ref(0);
const y = ref(0);
const width = ref(0);
const height = ref(0);

const selectedElements = shallowRef<Element[]>([]);

const selectedSubElements = shallowRef<Element[]>([]);

const isClickSubAction = computed(() => subAction.value === CLICK_ACTION);
const isInputSubAction = computed(() => subAction.value === INPUT_ACTION);
const isScrapeSubAction = computed(() => subAction.value === SCRAPE_ACTION);

const predictedParentsCount = computed(() => selectedElements.value.length - 2);

const elements = computed(() =>
  subAction.value ? selectedSubElements.value : selectedElements.value
);

const sizeIndicatorStyle = computed(() => {
  return {
    left: `${x.value}px`,
    top: `${y.value}px`,
    width: `${width.value}px`,
    height: `${height.value}px`,
  };
});

const selectedClasses = computed(() => {
  return [...new Set(elements.value.map((e) => e.className.split(" ")).flat())]
    .filter((className) => !RESERVED_CLASSNAMES.includes(className))
    .filter((className) => {
      return elements.value.every((el) => {
        return el.className.includes(className);
      });
    });
});

const selectedTagNames = computed(() => {
  return [...new Set(elements.value.map((e) => e.tagName))];
});

onMounted(() => toggleInspector());

function toggleInspector() {
  const listener = document.addEventListener;
  listener?.call(document.body, "mousemove", updatePosition);
  listener?.call(document.body, "click", handleClick, true);
}

function getTargetNode(e: Event) {
  const path = e.composedPath() as HTMLElement[];
  if (!path) null;
  const isAutomationPanel = path.some((n) => n.hasAttribute?.(KEY_IGNORE));
  if (isAutomationPanel) return null;
  const [targetNode] = path;
  return targetNode;
}

function handleClick(e: Event) {
  const targetNode = getTargetNode(e);
  const ctrlKeyPressed =
    (e as KeyboardEvent).ctrlKey || (e as KeyboardEvent).metaKey;
  if (!targetNode || !enableInspector.value || ctrlKeyPressed) return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  selectElement(e.target as Element);
}

function updatePosition(e: Event) {
  const targetNode = getTargetNode(e);
  if (targetNode) {
    showOverlay.value = true;
    const rect = targetNode.getBoundingClientRect();
    x.value = rect.x;
    y.value = rect.y;
    width.value = rect.width;
    height.value = rect.height;
  } else {
    showOverlay.value = false;
  }
}

function onChooseSubAction(subaction: SubAction) {
  subAction.value = subaction;
  step.value = 3;
  selectedElements.value.forEach((e) => e.classList.add(DASHED_CLASSNAME));
}

function reset() {
  if (!subAction.value) {
    step.value = 1;
    selectedElements.value.forEach((el) => clearSelectedClasses(el));
    selectedElements.value = [];
  } else {
    step.value = 2;
    selectedSubElements.value.forEach((el) => clearSelectedClasses(el));
    selectedSubElements.value = [];
    subAction.value = "";
    inputValue.value = "";
  }
}

function clearSelectedClasses(element: Element) {
  element.classList.remove(USER_SELECTED_CLASSNAME);
  element.classList.remove(ALGO_SELECTED_CLASSNAME);
  element.classList.remove(DASHED_CLASSNAME);
  element.classList.remove(DARK_CLASSNAME);
}

function isSubElement(element: Element) {
  return selectedElements.value.some((el) => {
    return Array.from(el.childNodes).some((child) => child === element);
  });
}

function selectElement(element: Element, userSelected = true) {
  if (step.value === 2) return; // disable selection in this step
  const index = elements.value.findIndex((el) => el === element);
  if (index !== -1) {
    elements.value.splice(index, 1);
    clearSelectedClasses(element);
    return; // deselect an element if was already selected
  }
  const selectedSubElements = elements.value.filter((el) => {
    return Array.from(element.childNodes).some((child) => child === el);
  });
  selectedSubElements.forEach((el) => {
    clearSelectedClasses(el);
    const index = elements.value.findIndex((e) => e === el);
    // deselect child element if parent is selected
    if (index !== -1) elements.value.splice(index, 1);
  });

  // select element
  elements.value.push(element);

  // add classnames for styling
  if (userSelected) element.classList.add(USER_SELECTED_CLASSNAME);
  else element.classList.add(ALGO_SELECTED_CLASSNAME);
  if (subAction.value) element.classList.add(DARK_CLASSNAME);

  const shouldPredict =
    (subAction.value && elements.value.length) || elements.value.length > 1;
  if (shouldPredict && userSelected) predictSimilar();
}

function predictByClassName() {
  if (!selectedClasses.value.length) return [];
  const similar = document.body.querySelectorAll(
    selectedClasses.value.map((c) => `.${c}`).join("")
  );
  if (similar.length <= elements.value.length) return [];
  return Array.from(similar)
    .map((el) => {
      if (elements.value.find((e) => e === el)) return;
      if (subAction.value && !isSubElement(el)) return;
      return el;
    })
    .filter(Boolean) as Element[];
}

function predictByTagName() {
  if (selectedTagNames.value.length !== 1) return [];
  const similar = document.body.getElementsByTagName(selectedTagNames.value[0]);
  if (similar.length <= elements.value.length) return [];
  return Array.from(similar)
    .map((el) => {
      if (elements.value.find((e) => e === el)) return;
      if (subAction.value && !isSubElement(el)) return;
      return el;
    })
    .filter(Boolean) as Element[];
}

function predictSimilar() {
  const predictedByClassName = predictByClassName();
  if (predictedByClassName.length) {
    predictedByClassName.forEach((el) => selectElement(el, false));
    return;
  }
  const predictedByTagName = predictByTagName();
  if (predictedByTagName.length) {
    predictedByTagName.forEach((el) => selectElement(el, false));
    return;
  }
  // todo: add complex searches
}

async function runBot() {
  enableInspector.value = false;
  await Promise.all(
    selectedSubElements.value.map((el) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (isClickSubAction.value) (el as HTMLButtonElement).click();
          if (isInputSubAction.value) {
            (el as HTMLInputElement).value = inputValue.value;
          }
          if (isScrapeSubAction.value) {
            console.log(el);
          }
          resolve(null);
        }, 100);
      });
    })
  );
  enableInspector.value = true;
}
</script>

<template>
  <div class="automation-panel" inspector-ignore="true">
    <div class="automation-content p-4">
      <div class="step-1" v-if="step === 1">
        <h1 class="font-bold">Step 1: For loop</h1>
        <p class="py-8" v-if="selectedElements.length < 2">Select an element</p>
        <div class="py-8" v-if="selectedElements.length > 2">
          <p>
            Great! You selected 2 elements, we predicted
            {{ predictedParentsCount }} additional element{{
              predictedParentsCount > 1 ? "s" : ""
            }}
          </p>
          <p>In total, {{ selectedElements.length }} elements are selected</p>
        </div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded border border-blue-500 text-blue-500"
            @click="reset()"
          >
            Reset
          </button>
          <button
            class="px-4 py-2 rounded bg-blue-500 text-white"
            :class="{
              'bg-blue-500 text-white': selectedElements.length,
              'bg-gray-400': !selectedElements.length,
            }"
            @click="step = 2"
            :disabled="!selectedElements.length"
          >
            Save
          </button>
        </div>
      </div>
      <div class="step-2" v-if="step === 2">
        <h1 class="font-bold">
          Step 2: Choose a child-action for each loop element
        </h1>
        <p class="py-4">Add action you want the bot to do on the page</p>
        <div class="flex gap-4">
          <button
            @click="onChooseSubAction(CLICK_ACTION)"
            :class="{
              'border-blue-500': isClickSubAction,
              'border-gray-400': !isClickSubAction,
            }"
            class="px-5 py-2 border"
          >
            Click a button
          </button>
          <button
            @click="onChooseSubAction(INPUT_ACTION)"
            :class="{
              'border-blue-500': isInputSubAction,
              'border-gray-400': !isInputSubAction,
            }"
            class="px-5 py-2 border"
          >
            Input Text
          </button>
          <button
            @click="onChooseSubAction(SCRAPE_ACTION)"
            :class="{
              'border-blue-500': isScrapeSubAction,
              'border-gray-400': !isScrapeSubAction,
            }"
            class="px-5 py-2 border"
          >
            Scrape Data
          </button>
        </div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded bg-blue-500 text-white"
            :class="{
              'bg-blue-500 text-white': selectedSubElements.length,
              'bg-gray-400': !selectedSubElements.length,
            }"
            :disabled="!selectedSubElements.length"
            @click="runBot()"
          >
            Run bot
          </button>
        </div>
      </div>
      <div class="step-3" v-if="step === 3">
        <h1 class="font-bold">
          Step 3: Click <span v-if="isClickSubAction">a button</span>
          <span v-if="isInputSubAction">an input field</span>
        </h1>
        <p class="py-4" v-if="!selectedSubElements.length || isClickSubAction">
          Select an <span v-if="isInputSubAction">input</span> element
        </p>
        <div class="py-4" v-if="isInputSubAction && selectedSubElements.length">
          <p>Enter some text</p>
          <input
            type="text"
            placeholder="Ex: search keyword, description..."
            class="px-2 py-1 my-1"
            v-model="inputValue"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded border border-blue-500 text-blue-500"
            @click="reset()"
          >
            Reset
          </button>
          <button
            class="px-4 py-2 rounded bg-blue-500 text-white"
            @click="step = 2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    <div
      class="inspector-size-indicator"
      :style="sizeIndicatorStyle"
      v-if="showOverlay"
    ></div>
  </div>
</template>

<style>
.automation-panel {
  width: 100%;
  position: fixed;
  left: 0px;
  bottom: 0px;
  border-radius: 2px;
  z-index: 99999;
}

.automation-panel .automation-content {
  background: white;
  margin: 0 auto;
  height: 20%;
  border-radius: 5px;
  width: 90%;
}

.inspector-size-indicator {
  z-index: 9999;
  position: fixed;
  background-color: #42b88325;
  border: 1px solid #42b88350;
  border-radius: 5px;
  transition: all 0.1s ease-in;
  pointer-events: none;
}

.--user-selected {
  border: 1px solid green !important;
}

.--user-selected.--dashed {
  border: 2px dashed lightgreen !important;
}

.--user-selected.--dark {
  border-width: 2px !important;
}

.--algo-selected {
  border: 1px solid blue !important;
}

.--algo-selected.--dashed {
  border: 2px dashed turquoise !important;
}

.--algo-selected.--dark {
  border-width: 3px !important;
}
</style>
