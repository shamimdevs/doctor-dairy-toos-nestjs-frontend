import type { Metadata } from "next";
import TermsAndConditions from "@/src/components/Legal/TermsAndConditions";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Terms & Conditions for shopping veterinary, dairy, and farm products on Doctor Dairy Tools, including orders, payments, shipping, and liability.",
};

const TermsAndConditionsPage = () => {
  return <TermsAndConditions />;
};

export default TermsAndConditionsPage;
