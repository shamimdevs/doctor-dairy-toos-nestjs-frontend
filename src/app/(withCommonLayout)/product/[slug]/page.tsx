// /* eslint-disable react-hooks/error-boundaries */

// import { getProductBySlug } from "@/src/components/services/product.service";
// import { notFound } from "next/navigation";

// type Props = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// export default async function ProductDetailsPage({ params }: Props) {
//   const { slug } = await params;

//   try {
//     const response = await getProductBySlug(slug);

//     const product = response.data?.data;
//     console.log(product, "product");

//     return (
//       <div className="container mx-auto p-20">
//         <h1 className="text-3xl font-bold">{product.name}</h1>
//       </div>
//     );
//   } catch (error) {
//     notFound();
//   }
// }

/* eslint-disable react-hooks/error-boundaries */

import ProductDetailsClient from "@/src/components/product/ProductDetailsClient";
import { getProductBySlug } from "@/src/components/services/product.service";

import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;

  try {
    const response = await getProductBySlug(slug);

    // Safeguard nested data structures based on your JSON schema
    const product = response?.data?.data;

    if (!product) {
      notFound();
    }

    return <ProductDetailsClient product={product} />;
  } catch (error) {
    console.error("Failed to load product page details:", error);
    notFound();
  }
}
