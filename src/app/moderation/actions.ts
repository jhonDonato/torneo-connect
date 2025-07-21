"use server";

import { moderateMessage, ModerateMessageInput } from "@/ai/flows/moderate-messages";
import { z } from "zod";

const FormSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío.").max(500, "El mensaje no puede exceder los 500 caracteres."),
});

export type ModerationState = {
  isSafe?: boolean;
  reason?: string;
  message?: string;
  errors?: {
    message?: string[];
  };
};

export async function checkMessageModeration(prevState: ModerationState, formData: FormData): Promise<ModerationState> {
  const validatedFields = FormSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const input: ModerateMessageInput = {
    message: validatedFields.data.message,
  };

  try {
    const result = await moderateMessage(input);
    return {
      isSafe: result.isSafe,
      reason: result.reason,
    };
  } catch (error) {
    console.error("AI Moderation Error:", error);
    return {
      errors: { message: ["Ocurrió un error al procesar el mensaje. Por favor, inténtalo de nuevo."] },
    };
  }
}
