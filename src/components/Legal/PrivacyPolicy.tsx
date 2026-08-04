import { ShieldCheck } from "lucide-react";
import LegalPageLayout, {
  type LegalSection as LegalSectionType,
} from "./LegalPageLayout";
import LegalSection from "./LegalSection";
import LegalNotice from "./LegalNotice";

const sections: LegalSectionType[] = [
  { id: "overview", title: "1. Overview" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Information" },
  { id: "cookies", title: "4. Cookies & Tracking Technologies" },
  { id: "sharing", title: "5. How We Share Information" },
  { id: "payment-security", title: "6. Payment Security" },
  { id: "data-retention", title: "7. Data Retention" },
  { id: "your-rights", title: "8. Your Rights & Choices" },
  { id: "data-security", title: "9. Data Security" },
  { id: "childrens-privacy", title: "10. Children's Privacy" },
  { id: "third-party-links", title: "11. Third-Party Links" },
  { id: "international", title: "12. Data Storage & Transfers" },
  { id: "changes", title: "13. Changes to This Policy" },
  { id: "contact", title: "14. Contact Us" },
];

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      icon={ShieldCheck}
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      description="This Privacy Policy explains how Doctor Dairy Tools collects, uses, shares, and protects your personal information when you visit our website or purchase our veterinary and farm products."
      effectiveDate="January 1, 2026"
      lastUpdated="August 4, 2026"
      sections={sections}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>
          Doctor Dairy Tools (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) respects your privacy and is committed to
          protecting the personal information you share with us. This Privacy
          Policy applies to all information collected through our website,
          customer support channels, and related services (collectively, the
          &ldquo;Website&rdquo;). By using the Website, you consent to the
          practices described in this Policy.
        </p>
      </LegalSection>

      <LegalSection
        id="information-we-collect"
        number={2}
        title="Information We Collect"
      >
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Account & Contact Information:</strong> name, phone number,
            email address, delivery address, and business/farm/clinic name (if
            applicable);
          </li>
          <li>
            <strong>Order Information:</strong> products purchased, order
            history, quantities, and delivery preferences;
          </li>
          <li>
            <strong>Payment Information:</strong> bKash transaction references
            or masked card details processed through our payment gateway
            partners; we do not store full card numbers or mobile wallet PINs;
          </li>
          <li>
            <strong>Technical Information:</strong> IP address, browser type,
            device information, and pages visited, collected automatically via
            cookies and similar technologies; and
          </li>
          <li>
            <strong>Communications:</strong> messages, reviews, and support
            requests you send us via email, phone, or chat.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="how-we-use"
        number={3}
        title="How We Use Your Information"
      >
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process, confirm, and deliver your orders;</li>
          <li>
            Communicate order updates, delivery status, and support responses;
          </li>
          <li>Process payments and prevent fraudulent transactions;</li>
          <li>
            Improve our Website, product catalog, and customer experience;
          </li>
          <li>
            Send promotional offers or updates, where you have opted in; and
          </li>
          <li>Comply with legal, tax, and regulatory obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection
        id="cookies"
        number={4}
        title="Cookies & Tracking Technologies"
      >
        <p>
          We use cookies and similar technologies to keep you signed in,
          remember your cart and preferences, and understand how visitors use
          our Website through analytics tools. You can control or disable
          cookies through your browser settings; however, some features of the
          Website (such as checkout) may not function properly if cookies are
          disabled.
        </p>
      </LegalSection>

      <LegalSection id="sharing" number={5} title="How We Share Information">
        <p>
          We do not sell your personal information. We may share your
          information with:
        </p>
        <ul>
          <li>
            <strong>Courier & logistics partners</strong>, to deliver your
            orders;
          </li>
          <li>
            <strong>Payment gateway providers</strong> (including bKash and card
            processors), to complete transactions securely;
          </li>
          <li>
            <strong>Service providers</strong> who support our hosting,
            analytics, SMS/email notifications, and customer support operations,
            under confidentiality obligations; and
          </li>
          <li>
            <strong>Government or regulatory authorities</strong>, where
            required by applicable law or to protect our legal rights.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="payment-security" number={6} title="Payment Security">
        <LegalNotice
          variant="info"
          title="Your payments are securely processed"
        >
          <p>
            All online payments (bKash and card transactions) are processed
            through PCI-DSS compliant, third-party payment gateways. Doctor
            Dairy Tools does not store your card number, CVV, or mobile
            financial service PIN on our servers.
          </p>
        </LegalNotice>
      </LegalSection>

      <LegalSection id="data-retention" number={7} title="Data Retention">
        <p>
          We retain personal information for as long as necessary to fulfil the
          purposes described in this Policy, including maintaining order records
          for warranty, accounting, and tax purposes, and to comply with legal
          obligations. When information is no longer needed, we take reasonable
          steps to securely delete or anonymize it.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" number={8} title="Your Rights & Choices">
        <p>You may, at any time:</p>
        <ul>
          <li>Request access to the personal information we hold about you;</li>
          <li>Ask us to correct inaccurate or outdated information;</li>
          <li>
            Request deletion of your account and personal data, subject to legal
            or contractual retention requirements;
          </li>
          <li>
            Opt out of marketing communications by using the unsubscribe link or
            contacting us directly; and
          </li>
          <li>
            Withdraw consent for optional data processing, where applicable.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:doctordairytoolsbd@gmail.com">
            doctordairytoolsbd@gmail.com
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </LegalSection>

      <LegalSection id="data-security" number={9} title="Data Security">
        <p>
          We implement reasonable administrative, technical, and physical
          safeguards designed to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction. However,
          no method of transmission over the internet or electronic storage is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection
        id="childrens-privacy"
        number={10}
        title="Children's Privacy"
      >
        <p>
          Our Website and products are intended for business, farm, and
          professional use and are not directed at children. We do not knowingly
          collect personal information from individuals under the age of 18. If
          you believe a child has provided us with personal information, please
          contact us so we can remove it.
        </p>
      </LegalSection>

      <LegalSection
        id="third-party-links"
        number={11}
        title="Third-Party Links"
      >
        <p>
          Our Website may contain links to third-party websites, such as social
          media pages or courier tracking portals. We are not responsible for
          the privacy practices of these third parties, and we encourage you to
          review their privacy policies before providing any personal
          information.
        </p>
      </LegalSection>

      <LegalSection
        id="international"
        number={12}
        title="Data Storage & Transfers"
      >
        <p>
          Your information may be stored and processed on servers located in
          Bangladesh or hosted by cloud service providers operating
          internationally. Where information is transferred outside Bangladesh,
          we take reasonable steps to ensure it continues to be protected in
          accordance with this Policy.
        </p>
      </LegalSection>

      <LegalSection id="changes" number={13} title="Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our practices or legal requirements. Material changes will be
          indicated by updating the &ldquo;Last Updated&rdquo; date above. We
          encourage you to review this Policy periodically.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={14} title="Contact Us">
        <p>
          If you have questions or concerns about this Privacy Policy or how
          your information is handled, please contact us:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:doctordairytoolsbd@gmail.com">
              doctordairytoolsbd@gmail.com
            </a>
          </li>
          <li>
            Phone: <a href="tel:+8809612362867">+880 1797-980777</a>
          </li>
          <li>
            Address: প্রজাবাহীনী প্রেস লেন (অন্নপূর্ণা হোটেলের গলি), সাতমাথা,
            বগুড়া সদর, Puran Bogra, Bangladesh, 5800
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
