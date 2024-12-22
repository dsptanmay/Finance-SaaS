import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({
        queryKey: ["category", { id }],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });
  return mutation;
};
