import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useConfirm } from "@/hooks/use-confirm";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useGetSingleTransaction } from "@/features/transactions/api/use-get-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import TransactionForm from "./transaction-form";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
  id: true,
});
type FormValues = z.infer<typeof formSchema>;

function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransaction();
  const transactionQuery = useGetSingleTransaction(id);

  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryMutation = useCreateCategory();
  const categoryQuery = useGetCategories();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountMutation = useCreateAccount();
  const accountQuery = useGetAccounts();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;
  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );

  const onDelete = async () => {
    const ok = await confirm();
    if (ok)
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>Edit an existing transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            id={id}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onDelete={onDelete}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
      <ConfirmationDialog />
    </Sheet>
  );
}

export default EditTransactionSheet;
