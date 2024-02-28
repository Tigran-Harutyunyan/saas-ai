<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { Zap } from "lucide-vue-next";

const { toast } = useToast();

const loading = ref(false);

const { isPro } = defineProps<{
  isPro: boolean | null;
}>();

const onClick = async () => {
  try {
    loading.value = true;

    const response = await $fetch("/api/stripe", {
      method: "POST",
    });

    if (response && typeof response === "object" && "url" in response) {
      window.location.href = response.url as string;
    }
  } catch (error) {
    toast({
      description: "Something went wrong",
      variant: "destructive",
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Button
    v-show="isPro !== null"
    size="sm"
    :variant="isPro ? 'default' : 'premium'"
    :disabled="loading"
    @click="onClick"
  >
    {{ isPro ? "Manage Subscription" : "Upgrade" }}
    <Zap v-if="!isPro" class="w-4 h-4 ml-2 fill-white" />
  </Button>
</template>
