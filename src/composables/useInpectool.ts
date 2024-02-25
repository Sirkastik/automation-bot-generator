export const useInspectool = () => {
  const KEY_IGNORE = "inspectool-ignore";

  const enableInspectool = ref(true);
  const showElementOverlay = ref(true);
  const targetElement = shallowRef<Element | null>(null);

  const x = ref(0);
  const y = ref(0);
  const width = ref(0);
  const height = ref(0);

  const elementOverlayStyle = computed(() => {
    return {
      left: `${x.value}px`,
      top: `${y.value}px`,
      width: `${width.value}px`,
      height: `${height.value}px`,
    };
  });

  onMounted(() => toggleInspectool(true));

  onUnmounted(() => toggleInspectool(false));

  function toggleInspectool(value?: boolean) {
    enableInspectool.value = value ?? !enableInspectool.value;
    const listener =
      document[value ? "addEventListener" : "removeEventListener"];
    listener?.call(document.body, "mousemove", updatePosition);
    listener?.call(document.body, "click", handleClick, true);
  }

  function updatePosition(e: Event) {
    const targetNode = getTargetNode(e);
    if (targetNode) {
      showElementOverlay.value = true;
      const rect = targetNode.getBoundingClientRect();
      x.value = rect.x;
      y.value = rect.y;
      width.value = rect.width;
      height.value = rect.height;
    } else {
      showElementOverlay.value = false;
    }
  }

  function handleClick(e: Event) {
    const targetNode = getTargetNode(e);
    const ctrlKeyPressed =
      (e as KeyboardEvent).ctrlKey || (e as KeyboardEvent).metaKey;
    if (!targetNode || !enableInspectool.value || ctrlKeyPressed) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    targetElement.value = e.target as Element;
  }

  function getTargetNode(e: Event) {
    const path = e.composedPath() as HTMLElement[];
    if (!path) null;
    return path.some((n) => n.hasAttribute?.(KEY_IGNORE)) ? null : path[0];
  }

  return {
    enableInspectool,
    showElementOverlay,
    elementOverlayStyle,
    targetElement,
    toggleInspectool,
  };
};
