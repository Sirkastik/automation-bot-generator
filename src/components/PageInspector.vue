<script setup lang="ts">
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

type SubAction =
  | typeof CLICK_ACTION
  | typeof INPUT_ACTION
  | typeof SCRAPE_ACTION;

const step = ref<1 | 2 | 3>(1);

const subAction = ref<SubAction | "">("");

const inputValue = ref("");

const {
  enableInspectool,
  showElementOverlay,
  elementOverlayStyle,
  targetElement,
  toggleInspectool,
} = useInspectool();

watch(targetElement, (el) => {
  if (!el) return;
  selectElement(el);
});

const selectedElements = ref<Element[]>([]);

const selectedSubElements = ref<Element[]>([]);

const isClickSubAction = computed(() => subAction.value === CLICK_ACTION);
const isInputSubAction = computed(() => subAction.value === INPUT_ACTION);
const isScrapeSubAction = computed(() => subAction.value === SCRAPE_ACTION);

const predictedParentsCount = computed(() => selectedElements.value.length - 2);

const elements = computed(() =>
  subAction.value ? selectedSubElements.value : selectedElements.value
);

const selectedClasses = computed(() => {
  return [...new Set(elements.value.map((e) => e.className.split(" ")).flat())]
    .filter((className) => !className.includes(":"))
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

function useParentElements() {
  selectedSubElements.value = selectedElements.value;
  selectedElements.value = [];
  step.value = 2;
}

async function runBot() {
  enableInspectool.value = false;
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
  enableInspectool.value = true;
}

const showInspectorPanel = ref(false);

watch(showInspectorPanel, (show) => {
  toggleInspectool(show);
});
</script>

<template>
  <div
    v-if="showInspectorPanel"
    id="inspector-panel"
    class="fixed z-[99999] bottom-4 left-[5%] right-[5%] bg-gray-50 h-[25%] min-h-[h-full] px-8 py-8 rounded-lg border border-gray-300"
    inspectool-ignore
  >
    <ForLoop
      v-if="step === 1"
      :selected-elements="selectedElements"
      :predicted-parents-count="predictedParentsCount"
      @next-step="step = 2"
      @reset="reset"
    />
    <ActionSelector
      v-if="step === 2"
      :selected-sub-elements="selectedSubElements"
      :sub-action="subAction"
      @run-bot="runBot"
      @select-subaction="onChooseSubAction"
      @reset="reset"
    />
    <ActionConfig
      v-if="step === 3"
      v-model="inputValue"
      :selected-sub-elements="selectedSubElements"
      :sub-action="subAction"
      @reset="reset"
      @previous="step = 2"
      @use-parent-elements="useParentElements"
    />
  </div>

  <div
    class="fixed z-[999999] bottom-1 left-0 right-0 grid place-content-center pointer-events-none"
    inspectool-ignore
  >
    <button
      class="z-50 pointer-events-auto border border-gray-400 text-gray-500 rounded-full p-1 bg-gray-100 hover:text-xl"
      @click="showInspectorPanel = !showInspectorPanel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 15 15"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M7.5 0a.5.5 0 0 1 .5.5v1.307A5.624 5.624 0 0 1 13.007 7H14.5a.5.5 0 0 1 0 1h-1.511A5.625 5.625 0 0 1 8 12.989V14.5a.5.5 0 0 1-1 0v-1.493A5.624 5.624 0 0 1 1.807 8H.5a.5.5 0 0 1 0-1h1.289A5.624 5.624 0 0 1 7 1.789V.5a.5.5 0 0 1 .5-.5M8 12.032V9.5a.5.5 0 0 0-1 0v2.554A4.675 4.675 0 0 1 2.763 8H5.5a.5.5 0 0 0 0-1H2.742A4.674 4.674 0 0 1 7 2.742V5.5a.5.5 0 0 0 1 0V2.763A4.675 4.675 0 0 1 12.054 7H9.5a.5.5 0 0 0 0 1h2.532A4.675 4.675 0 0 1 8 12.032"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>

  <div
    v-show="showElementOverlay"
    class="fixed z-[9999] bg-[#42b88325] border border-[#42b88350] rounded-md pointer-events-none transition-all duration-100 ease-in"
    :style="elementOverlayStyle"
    inspectool-ignore
  ></div>
</template>

<style lang="css">
#inspector-panel > * {
  font-family: "Inter" !important;
  line-height: 1.3 !important;
  letter-spacing: normal !important;
  font-weight: 400 !important;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
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
