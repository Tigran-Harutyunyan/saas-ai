<script setup lang="ts">
import LandingNavbar from "@/components/landing/LandingNavbar.vue";
import LandingHero from "@/components/landing/LandingHero.vue";
import LandingContent from "@/components/landing/LandingContent.vue";

definePageMeta({ middleware: "public", layout: "landing" });

useHead({
  title: "Saas genius | Home",
});
</script>
<template>
  <main class="h-full bg-[#111827] overflow-auto">
    <div class="mx-auto max-w-screen-xl h-full w-full">
      <div class="h-full">
        <LandingNavbar />
        <LandingHero />
        <LandingContent />
      </div>
    </div>
  </main>
</template>
