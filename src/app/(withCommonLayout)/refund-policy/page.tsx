import type { Metadata } from "next";
import RefundPolicy from "@/src/components/Legal/RefundPolicy";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description:
    "Understand the return window, eligibility conditions, and refund timelines for veterinary, dairy, and farm products purchased from Doctor Dairy Tools.",
};

const RefundPolicyPage = () => {
  return <RefundPolicy />;
};

export default RefundPolicyPage;
