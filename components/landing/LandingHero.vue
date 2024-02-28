<script setup lang="ts">
import { Button } from "@/components/ui/button";
import Typewriter from "typewriter-effect/dist/core";
import { useClerkProvide } from "vue-clerk";

const { derivedState } = useClerkProvide();

const typewriterRef = ref(null);

const isAuth = computed(() => {
  return !!derivedState.value?.userId;
});

onMounted(() => {
  if (typewriterRef.value) {
    const typewriter = new Typewriter(typewriterRef.value, {
      strings: [
        "Chatbot.",
        "Photo Generation.",
        "Blog Writing.",
        "Mail Writing.",
      ],
      autoStart: true,
      loop: true,
    });
    typewriter.start();
  }
});
</script>

<template>
  <div class="text-white font-bold py-36 text-center space-y-5">
    <div
      class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold"
    >
      <h1>The Best AI Tool for</h1>
      <div
        class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
      >
        <div ref="typewriterRef"></div>
      </div>
    </div>
    <div class="text-sm md:text-xl font-light text-zinc-400">
      Create content using AI 10x faster.
    </div>
    <div>
      <NuxtLink :to="isAuth ? '/dashboard' : '/sign-up'">
        <Button
          variant="premium"
          class="md:text-lg p-4 md:p-6 rounded-full font-semibold"
        >
          Start Generating For Free
        </Button>
      </NuxtLink>
    </div>
    <div class="text-zinc-400 text-xs md:text-sm font-normal">
      No credit card required.
    </div>
  </div>
</template>
