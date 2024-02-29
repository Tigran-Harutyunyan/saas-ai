<script setup lang="ts">
import { MessageSquare } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { formSchema } from "@/constants/conversation";

import { useForm } from "vee-validate";

import { type ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";

import BotAvatar from "@/components/BotAvatar.vue";
import Loader from "@/components/Loader.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import Empty from "@/components/Empty.vue";
import Heading from "@/components/Heading.vue";

import { useMainStore } from "@/stores/main";

useHead({
  title: "AI genius | Conversation",
});

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
    const response = await $fetch("/api/conversation", {
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
      title="Conversation"
      description="Our most advanced conversation model."
      :icon="MessageSquare"
      iconColor="text-violet-500"
      bgColor="bg-violet-500/10"
    />
    <div class="px-4 lg:px-8">
      <div>
        <form
          @submit.prevent="onSubmit"
          class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
        >
          <FormField name="prompt" v-slot="{ componentField }">
            <FormItem class="col-span-12 lg:col-span-10">
              <FormControl class="m-0">
                <Input
                  class="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                  v-bind="componentField"
                  :disabled="isLoading"
                  placeholder="How do I calculate the radius of a circle?"
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
      </div>
      <div class="space-y-4 mt-4">
        <div
          v-if="isLoading"
          class="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
        >
          <Loader />
        </div>
        <Empty
          v-if="messages.length === 0 && !isLoading"
          label="No conversation started."
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

            <p class="text-sm">
              {{ message.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
