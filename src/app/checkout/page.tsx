import { auth } from "@/lib/auth";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  const userName = session?.user?.name ?? "";

  return <CheckoutForm userName={userName} />;
}
