<script setup lang="ts">
const USER_SELECTED_CLASSNAME = '___inspectool_user-selected'

const ALGO_SELECTED_CLASSNAME = '___inspectool_algo-selected'

const RESERVED_CLASSNAMES = [USER_SELECTED_CLASSNAME, ALGO_SELECTED_CLASSNAME]

enum Pane {
  SELECT,
  ACTION,
  CONFIG,
}

const pane = ref<Pane>(Pane.SELECT)

enum Actions {
  Input,
  Scrape,
  Click,
}

const action = ref<Actions>()

const inputActionText = ref('')

const {
  enableInspectool,
  showElementOverlay,
  elementOverlayStyle,
  targetElement,
  toggleInspectool,
} = useInspectool()

watch(targetElement, (el) => {
  if (!el) return
  onChooseTarget(el)
})

const shouldAutoPredict = ref(true)

const targets = ref<Element[]>([])

const clickedTargets = computed(() =>
  targets.value.filter((el) => el.classList.contains(USER_SELECTED_CLASSNAME)),
)

const sharedTargetClasses = computed(() => {
  return [...new Set(targets.value.map((e) => Array.from(e.classList)).flat())]
    .filter((className) => !className.includes(':'))
    .filter((className) => !RESERVED_CLASSNAMES.includes(className))
    .filter((className) => {
      return targets.value.every((el) => {
        return el.className.includes(className)
      })
    })
})

const targetTags = computed(() => {
  return [...new Set(targets.value.map((e) => e.tagName))]
})

const targetAttributes = computed(() => {
  return targets.value
    .map((e) => Array.from(e.attributes))
    .flat()
    .map((attr) => attr.name)
})

const similarTargets = computed(() => {
  if (!shouldAutoPredict.value) return []
  if (clickedTargets.value.length < 2) return []
  if (!sharedTargetClasses.value.length) return []
  const byTagNameAndClasses = document.body.querySelectorAll(
    sharedTargetClasses.value
      .map((c) => targetTags.value.map((t) => `${t}.${c}`).join(','))
      .join(','),
  )
  if (byTagNameAndClasses.length) {
    return addSelectedClass(byTagNameAndClasses)
  }
  const byTagNameAndAttributes = document.body.querySelectorAll(
    targetAttributes.value
      .map((a) => targetTags.value.map((t) => `${t}[${a}]`).join(','))
      .join(','),
  )
  if (byTagNameAndAttributes.length) {
    return addSelectedClass(byTagNameAndAttributes)
  }
  const byClassesAndAttributes = document.body.querySelectorAll(
    sharedTargetClasses.value
      .map((c) => targetAttributes.value.map((a) => `.${c}[${a}]`).join(','))
      .join(','),
  )
  if (byClassesAndAttributes.length) {
    return addSelectedClass(byClassesAndAttributes)
  }
  const byClassnamesOnly = document.body.querySelectorAll(
    sharedTargetClasses.value.map((c) => `.${c}`).join(''),
  )
  if (byClassnamesOnly.length) {
    return addSelectedClass(byClassnamesOnly)
  }
  const byTagNamesOnly = document.body.querySelectorAll(
    targetTags.value.map((t) => t).join(''),
  )
  if (byTagNamesOnly.length) {
    return addSelectedClass(byTagNamesOnly)
  }
  const byAttributesOnly = document.body.querySelectorAll(
    targetAttributes.value.map((a) => `[${a}]`).join(''),
  )
  if (byAttributesOnly.length) {
    return addSelectedClass(byAttributesOnly)
  }
  return []
})

function addSelectedClass(nodes: NodeListOf<Element>) {
  nodes.forEach((el) => {
    if (targets.value.includes(el)) return
    el.classList.add(ALGO_SELECTED_CLASSNAME)
  })
  return Array.from(nodes).filter((el) => !targets.value.includes(el))
}

function onChooseTarget(el: Element) {
  // find element in targets
  const index = targets.value.findIndex((e) => e === el)
  if (index !== -1) {
    targets.value.splice(index, 1)
    clearSelectedClasses(el)
    return
  }

  el.classList.add(USER_SELECTED_CLASSNAME)
  targets.value.push(el)
}

function clearSelectedClasses(element: Element) {
  const classList = Array.from(element.classList)
  element.classList.remove(
    ...classList.filter((c) => c.startsWith('___inspectool')),
  )
}

function onChooseAction(_action: Actions) {
  action.value = _action
  pane.value = Pane.CONFIG
}

function reset() {
  pane.value = Pane.SELECT
}

// async function runBot() {
//   enableInspectool.value = false;
//   await Promise.all(
//     selectedSubElements.value.map((el) => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           if (isClickSubAction.value) (el as HTMLButtonElement).click();
//           if (isInputSubAction.value) {
//             (el as HTMLInputElement).value = inputValue.value;
//           }
//           if (isScrapeSubAction.value) {
//             console.log(el);
//           }
//           resolve(null);
//         }, 100);
//       });
//     })
//   );
//   enableInspectool.value = true;
// }

const showInspectorPanel = ref(false)

watch(showInspectorPanel, (show) => {
  toggleInspectool(show)
})
</script>

<template>
  <div
    v-if="showInspectorPanel"
    id="inspector-panel"
    class="fixed bottom-4 left-[5%] right-[5%] z-[99999] grid min-h-[h-full] grid-cols-[50px_1fr] divide-x overflow-hidden rounded-lg border border-gray-300 bg-gray-50"
    inspectool-ignore
  >
    <div class="bg-white text-xl">
      <div class="grid h-[50px] place-content-center border-b">
        <IconsLogo class="text-2xl text-blue-700" />
      </div>
      <div class="flex flex-col items-center gap-2 py-2">
        <button
          @click="toggleInspectool(!enableInspectool)"
          class="rounded p-1 text-xl text-gray-500 hover:bg-gray-200"
          :class="{
            'bg-blue-200 bg-opacity-50': enableInspectool,
          }"
        >
          <IconsInspect />
        </button>
        <button class="rounded p-1 text-xl text-gray-500 hover:bg-gray-200">
          <IconsCode />
        </button>
        <button class="rounded p-1 text-xl text-gray-500 hover:bg-gray-200">
          <IconsDebug />
        </button>
        <button class="rounded p-1 text-xl text-gray-500 hover:bg-gray-200">
          <IconsCogs />
        </button>
      </div>
    </div>
    <div class="px-4 pb-4 pt-2">
      <PaneSelect
        v-if="pane === Pane.SELECT"
        :selected-count="targets.length"
        :predicted-count="similarTargets.length"
        :should-auto-predict="true"
        @proceed="pane = Pane.ACTION"
      />

      <PaneActions
        v-if="pane === Pane.ACTION"
        @reset="reset"
        @choose-action="onChooseAction"
      />

      <!-- <ForLoop
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
      /> -->
      <ActionConfig
        v-if="pane === Pane.CONFIG"
        v-model="inputActionText"
        :selected-sub-elements="[]"
        @reset="reset"
        @previous="pane = Pane.ACTION"
      />
    </div>
  </div>

  <div
    class="pointer-events-none fixed bottom-1 left-0 right-0 z-[999999] grid place-content-center"
    inspectool-ignore
  >
    <button
      class="pointer-events-auto z-50 rounded-full border border-gray-400 bg-gray-100 p-1 text-gray-500 hover:text-xl"
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
    class="pointer-events-none fixed z-[9999] rounded-md border border-[#42b88350] bg-[#42b88325] transition-all duration-100 ease-in"
    :style="elementOverlayStyle"
    inspectool-ignore
  ></div>
</template>

<style lang="css">
.___inspectool_user-selected {
  background-color: #42b88325 !important;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%2342B88350' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

/* .___user-selected.___dashed {
  background-image: none !important;
  box-shadow: 0 0 4px 1px #42b8835d !important;
} */

.___inspectool_algo-selected {
  background-color: #427bb823 !important;

  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23427bb86a' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

/* .___algo-selected.___dashed {
  background-image: none !important;
  box-shadow: 0 0 4px 1px #427bb86a !important;
} */
</style>
