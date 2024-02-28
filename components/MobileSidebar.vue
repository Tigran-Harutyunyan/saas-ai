<script setup lang="ts">
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-vue-next";
import Sidebar from "@/components/Sidebar.vue";

const { isPro } = defineProps<{
  isPro: boolean;
}>();
</script>

<template>
  <Sheet>
    <SheetTrigger class="md:hidden pr-4">
      <Button variant="ghost" size="icon" class="md:hidden">
        <Menu />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="p-0 border-none">
      <Sidebar :isPro="isPro" />
    </SheetContent>
  </Sheet>
</template>
