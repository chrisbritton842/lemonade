import { redirect } from "next/navigation";
import { StartBusinessWizard } from "@/features/cooperatives/components/start-business-wizard";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { signInPagePath } from "@/paths";

const NewBusinessPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(signInPagePath());
  }
  
  return <StartBusinessWizard />;
};

export default NewBusinessPage;