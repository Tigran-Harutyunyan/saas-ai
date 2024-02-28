<script setup lang="ts">
import "highlight.js/styles/default.css";
import { Code } from "lucide-vue-next";
import { formSchema } from "@/constants/code";
import { useForm } from "vee-validate";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";

import Loader from "@/components/Loader.vue";
import Empty from "@/components/Empty.vue";
import Heading from "@/components/Heading.vue";

import { useMainStore } from "@/stores/main";

import { type ChatCompletionMessageParam } from "openai/resources/chat/completions";

definePageMeta({ middleware: "auth", layout: "dashboard" });

const { setProModal, updateEventTrigger } = useMainStore();

const { toast } = useToast();

const form = useForm({
  validationSchema: formSchema,
});

const messages = ref<ChatCompletionMessageParam[]>([]);

const isLoading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;

  const userMessage: ChatCompletionMessageParam = {
    role: "user",
    content: values.prompt,
  };

  messages.value.push(userMessage);

  const newMessages = [...messages.value, userMessage];

  try {
    const response = await $fetch("/api/code", {
      method: "POST",
      body: { messages: newMessages },
    });

    if (response && typeof response === "object" && "content" in response) {
      messages.value.push(response);
      form.resetForm();
    }
  } catch (error) {
    if (error?.response?.status === 403) {
      setProModal(true);
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
        duration: 3000,
      });
    }
  } finally {
    isLoading.value = false;
    updateEventTrigger();
  }
});
</script>

<template>
  <div>
    <Heading
      title="Code Generation"
      description="Generate code using descriptive text."
      :icon="Code"
      iconColor="text-green-700"
      bgColor="bg-green-700/10"
    />
    <div class="px-4 lg:px-8">
      <form
        @submit.prevent="onSubmit"
        class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <FormField name="prompt" v-slot="{ componentField }">
          <FormItem class="col-span-12 lg:col-span-10">
            <FormControl class="m-0">
              <Input
                class="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                v-bind="componentField"
                :disabled="isLoading"
                placeholder="Javascript closure"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <Button
          class="col-span-12 lg:col-span-2 w-full"
          type="submit"
          :disabled="isLoading"
          size="icon"
        >
          Generate
        </Button>
      </form>
      <div class="space-y-4 mt-4">
        <div v-if="isLoading" class="p-20">
          <Loader />
        </div>
        <Empty
          v-if="messages.length === 0 && !isLoading"
          label="No code generation started."
        />
        <div class="flex flex-col-reverse gap-y-4">
          <div
            v-for="message in messages"
            :key="message.content"
            :class="
              cn(
                'p-8 w-full flex items-start gap-x-8 rounded-lg',
                message.role === 'user'
                  ? 'bg-white border border-black/10 items-center'
                  : 'bg-muted'
              )
            "
          >
            <UserAvatar v-if="message.role === 'user'" />
            <BotAvatar v-else />

            <p class="text-sm" v-if="message.role === 'user'">
              {{ message.content }}
            </p>

            <div
              v-else
              v-html="$md.render(message.content!)"
              class="markdown-it-content"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.markdown-it-content pre {
  margin: 20px 0;
}

.markdown-it-content > p {
  line-height: 28px;
  font-family: "POPPINS";
}
</style>
