import { $api } from "@/api/BaseUrl";
import { create } from "zustand";

interface Prompt {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptsStore {
  isLoading: boolean;
  error: string | null;
  prompts: Prompt[];
  fetchAllPrompts: () => Promise<void>;
  updateSystemPrompt: (name: string, newContent: string) => Promise<void>;
}

export const usePromptsStore = create<PromptsStore>((set) => ({
  isLoading: false,
  error: null,
  prompts: [],
  fetchAllPrompts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.get(
        `${import.meta.env.VITE_API_URL}/api/ai/system-prompts`,
      );
      set({ prompts: response.data.prompts, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: "Failed to fetch prompts", isLoading: false });
    }
  },
  updateSystemPrompt: async (name: string, newContent: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.put(
        `${import.meta.env.VITE_API_URL}/api/ai/system-prompt`,
        {
          name,
          newContent,
        },
      );
      const updatedPrompt = response.data.prompt;
      console.log(updatedPrompt);
      set((state) => ({
        prompts: state.prompts.map((prompt) =>
          prompt.name === name
            ? {
                ...prompt,
                content: newContent,
                updatedAt: new Date().toISOString(),
              }
            : prompt,
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error(`Error updating system prompt (name: ${name}):`, error);
      let errorMessage = "Failed to update prompt";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Missing required fields: name or newContent";
            break;
          case 403:
            errorMessage = "Only admins can update system prompts";
            break;
          case 404:
            errorMessage =
              error.response.data.message === "User not found"
                ? "User not found"
                : "System prompt not found";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
        }
      }
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
