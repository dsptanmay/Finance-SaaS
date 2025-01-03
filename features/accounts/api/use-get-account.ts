import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleAccount = (id?: string) => {
  const query = useQuery({
    queryKey: ["account", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await client.api.accounts[":id"].$get({ param: { id } });
      if (!response.ok) throw new Error("Failed to fetch account");
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
