import { FileText } from "lucide-react";
import LegalPageLayout, {
  type LegalSection as LegalSectionType,
} from "./LegalPageLayout";
import LegalSection from "./LegalSection";
import LegalNotice from "./LegalNotice";

const sections: LegalSectionType[] = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "eligibility", title: "2. Eligibility & Accounts" },
  { id: "products", title: "3. Product Information" },
  { id: "professional-use", title: "4. Veterinary & Professional Use Notice" },
  { id: "orders", title: "5. Orders & Order Acceptance" },
  { id: "pricing-payment", title: "6. Pricing & Payment" },
  { id: "shipping", title: "7. Shipping & Delivery" },
  { id: "returns", title: "8. Returns, Refunds & Cancellations" },
  { id: "warranty", title: "9. Warranty Disclaimer" },
  { id: "acceptable-use", title: "10. Acceptable Use" },
  { id: "ip", title: "11. Intellectual Property" },
  { id: "liability", title: "12. Limitation of Liability" },
  { id: "indemnity", title: "13. Indemnification" },
  { id: "third-party", title: "14. Third-Party Links & Services" },
  { id: "governing-law", title: "15. Governing Law & Dispute Resolution" },
  { id: "changes", title: "16. Changes to These Terms" },
  { id: "contact", title: "17. Contact Us" },
];

export default function TermsAndConditions() {
  return (
    <LegalPageLayout
      icon={FileText}
      eyebrow="Terms & Conditions"
      title="Terms & Conditions"
      description="These Terms & Conditions govern your access to and use of the Doctor Dairy Tools website and the purchase of veterinary, dairy, and farm products through our platform. Please read them carefully before placing an order."
      effectiveDate="January 1, 2026"
      lastUpdated="August 4, 2026"
      sections={sections}
    >
      <LegalSection id="acceptance" number={1} title="Acceptance of Terms">
        <p>
          By accessing or using the Doctor Dairy Tools website
          (&ldquo;Website&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;), creating an account, or placing an order, you
          (&ldquo;Customer&rdquo; or &ldquo;you&rdquo;) agree to be bound by
          these Terms &amp; Conditions (&ldquo;Terms&rdquo;), our{" "}
          <a href="/privacy-policy">Privacy Policy</a>, and our{" "}
          <a href="/refund-policy">Refund Policy</a>. If you do not agree with
          any part of these Terms, please discontinue use of the Website
          immediately.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" number={2} title="Eligibility & Accounts">
        <p>
          You must be at least 18 years old, or purchasing on behalf of a
          registered business, farm, clinic, or institution, to place an order
          on the Website. When you create an account, you agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information;</li>
          <li>Keep your login credentials confidential and secure;</li>
          <li>
            Notify us immediately of any unauthorized use of your account at{" "}
            <a href="mailto:doctordairytoolsbd@gmail.com">
              doctordairytoolsbd@gmail.com
            </a>
            ; and
          </li>
          <li>
            Accept responsibility for all activity carried out under your
            account.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="products" number={3} title="Product Information">
        <p>
          We sell veterinary surgical instruments, artificial insemination (AI)
          supplies, dairy farm tools and machinery, poultry equipment, and
          veterinary laboratory items. We make reasonable efforts to ensure
          product descriptions, specifications, images, and prices are accurate.
          However:
        </p>
        <ul>
          <li>
            Colors, dimensions, and packaging may vary slightly from images
            shown due to manufacturer updates or display settings;
          </li>
          <li>
            We reserve the right to correct any errors, inaccuracies, or
            omissions in product information, pricing, or availability at any
            time without prior notice; and
          </li>
          <li>
            Stock availability is not guaranteed until your order is confirmed.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="professional-use"
        number={4}
        title="Veterinary & Professional Use Notice"
      >
        <LegalNotice variant="warning" title="Important safety notice">
          <p>
            Surgical instruments, AI supplies, and laboratory equipment sold on
            this Website are intended for use by qualified veterinarians,
            trained farm technicians, or professionals experienced in animal
            husbandry. These products are designed for veterinary and
            agricultural use only and are not intended for human medical use.
          </p>
        </LegalNotice>
        <p className="mt-3">
          It is the Customer&rsquo;s responsibility to ensure that any person
          using the purchased instruments or equipment is appropriately trained
          and follows correct hygiene, sterilization, and safety practices.
          Doctor Dairy Tools is not liable for improper use, misuse, or use by
          untrained persons.
        </p>
      </LegalSection>

      <LegalSection id="orders" number={5} title="Orders & Order Acceptance">
        <p>
          Placing an order on the Website constitutes an offer to purchase. An
          order is only confirmed once you receive an order confirmation via
          email, SMS, or phone call from our team. We reserve the right to
          refuse, cancel, or limit any order for reasons including but not
          limited to:
        </p>
        <ul>
          <li>Product unavailability or stock discrepancies;</li>
          <li>Errors in pricing or product description;</li>
          <li>Suspected fraudulent or unauthorized transactions; and</li>
          <li>Inability to verify delivery details or contact information.</li>
        </ul>
        <p>
          If we cancel a confirmed and paid order, any amount already paid will
          be refunded in accordance with our{" "}
          <a href="/refund-policy">Refund Policy</a>.
        </p>
      </LegalSection>

      <LegalSection id="pricing-payment" number={6} title="Pricing & Payment">
        <p>
          All prices are listed in Bangladeshi Taka (BDT) and are inclusive of
          applicable taxes unless stated otherwise. Delivery charges, if any,
          are shown separately at checkout. We accept payment via:
        </p>
        <ul>
          <li>bKash and other supported mobile financial services;</li>
          <li>
            Debit/credit card payments through our secure payment gateway; and
          </li>
          <li>Cash on Delivery (COD), where available for your location.</li>
        </ul>
        <p>
          We do not store your full card or mobile financial service
          credentials; payments are processed through PCI-compliant, third-party
          payment gateways. See our <a href="/privacy-policy">Privacy Policy</a>{" "}
          for details on how payment data is handled.
        </p>
      </LegalSection>

      <LegalSection id="shipping" number={7} title="Shipping & Delivery">
        <p>
          We deliver nationwide across Bangladesh through our courier partners.
          Estimated delivery timelines are provided at checkout and during order
          confirmation but are not guaranteed, as they may be affected by
          courier delays, weather, remote locations, or force majeure events.
          Risk of loss and title for products pass to you upon delivery to the
          address provided at checkout. Please inspect your parcel at the time
          of delivery and report any visible damage to the courier and to us
          immediately.
        </p>
      </LegalSection>

      <LegalSection
        id="returns"
        number={8}
        title="Returns, Refunds & Cancellations"
      >
        <p>
          Returns, exchanges, and refunds are governed by our dedicated{" "}
          <a href="/refund-policy">Refund Policy</a>, which forms part of these
          Terms. Please review it before placing an order, as certain items
          (such as used surgical instruments and opened consumables) cannot be
          returned for hygiene and safety reasons.
        </p>
      </LegalSection>

      <LegalSection id="warranty" number={9} title="Warranty Disclaimer">
        <p>
          Where a manufacturer or brand warranty applies to a product, it is
          honored subject to the manufacturer&rsquo;s terms, and we will assist
          in facilitating warranty claims on your behalf. Except for such
          manufacturer warranties and any warranties that cannot be excluded
          under applicable law, all products are provided on an &ldquo;as
          is&rdquo; and &ldquo;as available&rdquo; basis without warranties of
          any kind, express or implied, including merchantability or fitness for
          a particular purpose.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" number={10} title="Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the Website for any unlawful purpose or in violation of these
            Terms;
          </li>
          <li>
            Attempt to gain unauthorized access to our systems, accounts, or
            data;
          </li>
          <li>
            Interfere with the security or proper functioning of the Website;
          </li>
          <li>
            Submit false, misleading, or fraudulent order or payment
            information; or
          </li>
          <li>
            Reproduce, scrape, or resell content from the Website without our
            written consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="ip" number={11} title="Intellectual Property">
        <p>
          All content on the Website, including the Doctor Dairy Tools name,
          logo, text, graphics, product photography, and design, is owned by or
          licensed to us and is protected under applicable intellectual property
          laws. You may not copy, modify, distribute, or use this content for
          commercial purposes without our prior written consent.
        </p>
      </LegalSection>

      <LegalSection id="liability" number={12} title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Doctor Dairy Tools shall not
          be liable for any indirect, incidental, special, or consequential
          damages, including loss of livestock, loss of profits, or business
          interruption, arising from the use or inability to use our products or
          Website. Our total liability for any claim arising from a purchase
          shall not exceed the amount you paid for the relevant product.
        </p>
      </LegalSection>

      <LegalSection id="indemnity" number={13} title="Indemnification">
        <p>
          You agree to indemnify and hold harmless Doctor Dairy Tools, its
          owners, employees, and partners from any claims, damages, liabilities,
          and expenses arising from your misuse of the Website or products,
          violation of these Terms, or infringement of any third-party rights.
        </p>
      </LegalSection>

      <LegalSection
        id="third-party"
        number={14}
        title="Third-Party Links & Services"
      >
        <p>
          The Website may contain links to third-party services, including
          payment gateways and courier partners. We are not responsible for the
          content, policies, or practices of any third-party websites or
          services, and your use of them is subject to their own terms and
          privacy policies.
        </p>
      </LegalSection>

      <LegalSection
        id="governing-law"
        number={15}
        title="Governing Law & Dispute Resolution"
      >
        <p>
          These Terms are governed by and construed in accordance with the laws
          of the People&rsquo;s Republic of Bangladesh. Any dispute arising out
          of or relating to these Terms or your use of the Website shall first
          be addressed through good-faith negotiation by contacting our support
          team. If unresolved, disputes shall be subject to the exclusive
          jurisdiction of the courts of Dhaka, Bangladesh.
        </p>
      </LegalSection>

      <LegalSection id="changes" number={16} title="Changes to These Terms">
        <p>
          We may update these Terms from time to time to reflect changes in our
          practices, products, or legal requirements. The &ldquo;Last
          Updated&rdquo; date at the top of this page indicates when changes
          were last made. Continued use of the Website after changes are posted
          constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={17} title="Contact Us">
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:doctordairytoolsbd@gmail.com">
              doctordairytoolsbd@gmail.com
            </a>
          </li>
          <li>
            Phone: <a href="tel:+8809612362867">+880 9612-DOCTOR (362867)</a>
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
