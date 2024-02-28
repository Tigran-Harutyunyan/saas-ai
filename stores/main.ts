import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const aiUsageEventTrigger = ref(0);
  const showProDialog = ref(false);

  function updateEventTrigger() {
    aiUsageEventTrigger.value++;
  }

  function setProModal(isOpen: boolean) {
    showProDialog.value = isOpen;
  }

  return {
    showProDialog,
    aiUsageEventTrigger,
    updateEventTrigger,
    setProModal
  };
});
