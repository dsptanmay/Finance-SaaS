import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
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
import { useCreateAccount } from "../api/use-create-account";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertAccountSchema.pick({
  name: true,
});
type FormValues = z.infer<typeof formSchema>;

function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();
  const mutation = useCreateAccount();
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
}

export default NewAccountSheet;
