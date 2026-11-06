export type AdminActionState = {
  status?: "success" | "error";
  message?: string;
};

export type AdminAction = (
  previousState: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;
