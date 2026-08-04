import { RotateCcw } from "lucide-react";
import LegalPageLayout, {
  type LegalSection as LegalSectionType,
} from "./LegalPageLayout";
import LegalSection from "./LegalSection";
import LegalNotice from "./LegalNotice";

const sections: LegalSectionType[] = [
  { id: "overview", title: "1. Overview" },
  { id: "eligibility-window", title: "2. Return Eligibility Window" },
  { id: "eligible-conditions", title: "3. Conditions for a Valid Return" },
  { id: "non-returnable", title: "4. Non-Returnable & Non-Refundable Items" },
  { id: "damaged-wrong", title: "5. Damaged, Defective, or Wrong Items" },
  { id: "how-to-request", title: "6. How to Request a Return" },
  { id: "inspection", title: "7. Inspection & Approval" },
  { id: "refund-method", title: "8. Refund Method & Timeline" },
  { id: "shipping-costs", title: "9. Return Shipping Costs" },
  { id: "exchanges", title: "10. Exchanges" },
  { id: "cancellations", title: "11. Order Cancellations" },
  { id: "contact", title: "12. Contact Us" },
];

export default function RefundPolicy() {
  return (
    <LegalPageLayout
      icon={RotateCcw}
      eyebrow="Refund Policy"
      title="Refund & Return Policy"
      description="We want you to be confident in every purchase from Doctor Dairy Tools. This policy explains how returns, exchanges, refunds, and order cancellations work for veterinary, dairy, and farm products purchased through our Website."
      effectiveDate="January 1, 2026"
      lastUpdated="August 4, 2026"
      sections={sections}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>
          This Refund &amp; Return Policy applies to all products purchased
          through the Doctor Dairy Tools website. It forms part of, and should
          be read together with, our{" "}
          <a href="/terms-and-conditions">Terms &amp; Conditions</a>. By placing
          an order, you agree to the terms set out below.
        </p>
      </LegalSection>

      <LegalSection
        id="eligibility-window"
        number={2}
        title="Return Eligibility Window"
      >
        <p>
          You may request a return or refund within{" "}
          <strong>3 calendar days</strong> of receiving your order, except for
          items reported as damaged, defective, or incorrect, which must be
          reported within <strong>24&ndash;48 hours</strong> of delivery as
          described in Section 5. Requests made after the applicable window
          cannot be accepted.
        </p>
      </LegalSection>

      <LegalSection
        id="eligible-conditions"
        number={3}
        title="Conditions for a Valid Return"
      >
        <p>To be eligible for a return, the product must be:</p>
        <ul>
          <li>Unused, uninstalled, and in its original condition;</li>
          <li>
            In its original packaging, with all accessories, manuals, tags, and
            protective seals intact;
          </li>
          <li>
            Free from signs of use, sterilization, wear, or exposure to animals
            or farm environments; and
          </li>
          <li>Accompanied by the original invoice or order confirmation.</li>
        </ul>
      </LegalSection>

      <LegalSection
        id="non-returnable"
        number={4}
        title="Non-Returnable & Non-Refundable Items"
      >
        <LegalNotice variant="warning" title="Hygiene & safety exclusions">
          <p>
            For health, hygiene, and safety reasons, the following items cannot
            be returned or refunded once delivered, unless they arrive damaged
            or defective:
          </p>
        </LegalNotice>
        <ul className="mt-3">
          <li>Used or unsealed surgical instruments, needles, and sharps;</li>
          <li>
            Opened AI (artificial insemination) supplies, straws, and consumable
            reagents;
          </li>
          <li>
            Opened veterinary lab items, test kits, and single-use diagnostic
            consumables;
          </li>
          <li>
            Medicines, vaccines, or any temperature-sensitive/perishable
            products;
          </li>
          <li>Custom, made-to-order, or special-order machinery; and</li>
          <li>
            Items marked as &ldquo;Final Sale&rdquo; or
            &ldquo;Non-Returnable&rdquo; at checkout.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="damaged-wrong"
        number={5}
        title="Damaged, Defective, or Wrong Items"
      >
        <p>
          If your order arrives damaged, defective, or different from what you
          ordered, please:
        </p>
        <ol>
          <li>
            Inspect your parcel at the time of delivery, wherever possible;
          </li>
          <li>
            Contact us within <strong>24&ndash;48 hours</strong> of delivery at{" "}
            <a href="mailto:doctordairytoolsbd@gmail.com">
              doctordairytoolsbd@gmail.com
            </a>{" "}
            or <a href="tel:+8809612362867">+880 9612-DOCTOR</a>; and
          </li>
          <li>
            Share clear photos or an unboxing video of the item, packaging, and
            shipping label to help us process your claim quickly.
          </li>
        </ol>
        <p>
          Once verified, we will offer a free replacement, repair, or full
          refund, including any delivery charges paid, at your choice.
        </p>
      </LegalSection>

      <LegalSection
        id="how-to-request"
        number={6}
        title="How to Request a Return"
      >
        <p>To initiate a return, please:</p>
        <ol>
          <li>
            Email{" "}
            <a href="mailto:doctordairytoolsbd@gmail.com">
              doctordairytoolsbd@gmail.com
            </a>{" "}
            or call <a href="tel:+8809612362867">+880 1797-980777</a> with your
            order number and reason for return;
          </li>
          <li>
            Our support team will confirm eligibility and share return
            instructions, including the return address and pickup arrangement,
            if applicable; and
          </li>
          <li>
            Pack the item securely in its original packaging before handing it
            over to our courier partner or drop-off point.
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="inspection" number={7} title="Inspection & Approval">
        <p>
          Once we receive the returned product, our team will inspect it within{" "}
          <strong>3&ndash;5 business days</strong> to confirm it meets the
          conditions in Section 3. We will notify you by email or phone of the
          approval or rejection of your return. If a return is rejected (for
          example, due to signs of use or missing components), the item will be
          shipped back to you at your cost.
        </p>
      </LegalSection>

      <LegalSection
        id="refund-method"
        number={8}
        title="Refund Method & Timeline"
      >
        <p>Once your return is approved, refunds are issued as follows:</p>
        <ul>
          <li>
            <strong>bKash / Mobile Financial Service payments:</strong> refunded
            to the original account within 5&ndash;7 business days;
          </li>
          <li>
            <strong>Card payments:</strong> refunded to the original card within
            7&ndash;10 business days, subject to your bank&rsquo;s processing
            time;
          </li>
          <li>
            <strong>Cash on Delivery orders:</strong> refunded via bKash
            transfer or bank transfer to an account you provide; and
          </li>
          <li>
            <strong>Store credit:</strong> available instantly upon request, for
            use on a future order.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="shipping-costs"
        number={9}
        title="Return Shipping Costs"
      >
        <p>
          If a return is due to our error (damaged, defective, or wrong item
          shipped), we cover the return shipping cost. For returns due to a
          change of mind or ordering the wrong item by mistake, return shipping
          costs are the responsibility of the Customer, and original delivery
          charges are non-refundable.
        </p>
      </LegalSection>

      <LegalSection id="exchanges" number={10} title="Exchanges">
        <p>
          We are happy to exchange an eligible item for a different size, model,
          or product of equal value, subject to stock availability. If the
          replacement item costs more, we will request the price difference
          before dispatch; if it costs less, we will refund or credit the
          difference.
        </p>
      </LegalSection>

      <LegalSection id="cancellations" number={11} title="Order Cancellations">
        <p>
          You may cancel an order free of charge before it has been dispatched
          by contacting our support team. Once an order has been shipped, it can
          no longer be cancelled and will instead be subject to this Refund
          &amp; Return Policy upon delivery. Custom or special-order machinery
          orders may not be cancelled once production or procurement has begun.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={12} title="Contact Us">
        <p>
          For any questions about returns, refunds, or cancellations, reach out
          to our support team:
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
