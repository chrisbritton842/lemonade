import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { signInPagePath } from "@/paths";

const BusinessesPage = async () => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    return <h2 className="text-lg">BusinessesPage</h2>;
};

export default BusinessesPage;