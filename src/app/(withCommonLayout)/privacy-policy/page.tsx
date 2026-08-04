import type { Metadata } from "next";
import PrivacyPolicy from "@/src/components/Legal/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Doctor Dairy Tools collects, uses, shares, and protects your personal information when you shop for veterinary and farm products.",
};

const PrivacyPolicyPage = () => {
  return <PrivacyPolicy />;
};

export default PrivacyPolicyPage;
