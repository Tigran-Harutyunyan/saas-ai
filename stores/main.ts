import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const aiUsageEventTrigger = ref(0);
  const showProDialog = ref(false);
  const isPro = ref(false);

  function updateEventTrigger() {
    aiUsageEventTrigger.value++;
  }

  function setProModal(isOpen: boolean) {
    showProDialog.value = isOpen;
  }

  function setPro(data: boolean) {
    isPro.value = data;
  }

  return {
    showProDialog,
    isPro,
    aiUsageEventTrigger,
    updateEventTrigger,
    setProModal,
    setPro
  };
});
