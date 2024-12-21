import AccountForm from "@/features/accounts/components/account-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useGetSingleAccount } from "@/features/accounts/api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertAccountSchema.pick({
  name: true,
});
type FormValues = z.infer<typeof formSchema>;

function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();
  const accountQuery = useGetSingleAccount(id);
  const isLoading = accountQuery.isLoading;

  const { mutate: editAccount, isPending: editPending } = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const isPending = editPending || deleteMutation.isPending;

  const onSubmit = (values: FormValues) => {
    editAccount(values, {
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

  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: "" };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Edit an existing account</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <AccountForm
            id={id}
            onSubmit={onSubmit}
            onDelete={onDelete}
            disabled={isPending}
            defaultValues={defaultValues}
          />
        )}
      </SheetContent>
      <ConfirmationDialog />
    </Sheet>
  );
}

export default EditAccountSheet;
