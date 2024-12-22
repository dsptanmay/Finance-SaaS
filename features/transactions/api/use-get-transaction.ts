import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleTransaction = (id?: string) => {
  const query = useQuery({
    queryKey: ["transaction", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });
      if (!response.ok) throw new Error("Failed to fetch transaction");
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
