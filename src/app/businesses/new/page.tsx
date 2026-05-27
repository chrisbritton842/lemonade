import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { signInPagePath } from "@/paths";

const NewBusinessPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(signInPagePath());
  }
  
  return <h2 className="text-lg">NewBusinessPage</h2>;
};

export default NewBusinessPage;