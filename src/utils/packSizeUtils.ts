// utils/packSizeUtils.ts
export const generatePackSizes = (
  productId: string,
  basePrice: number,
  baseDiscount: number = 0,
) => {
  const quantities = [10, 20, 30, 40, 50];
  const stripCounts = [1, 2, 3, 4, 5];
  const pricePerUnit = basePrice / 10; // Base price is for 10 tablets

  return quantities.map((quantity, index) => {
    const stripCount = stripCounts[index];
    const totalOriginalPrice = pricePerUnit * quantity;

    // Progressive discount for bulk purchases
    let discount = baseDiscount;
    if (quantity >= 50) discount = Math.min(baseDiscount + 11, 30);
    else if (quantity >= 40) discount = Math.min(baseDiscount + 9, 28);
    else if (quantity >= 30) discount = Math.min(baseDiscount + 7, 25);
    else if (quantity >= 20) discount = Math.min(baseDiscount + 5, 22);

    const discountedPrice = totalOriginalPrice * (1 - discount / 100);

    return {
      id: `${productId}-pack-${quantity}`,
      label: `${quantity} Tablets (${stripCount} Strip${stripCount > 1 ? "s" : ""})`,
      quantity,
      stripCount,
      price: Math.round(discountedPrice * 100) / 100,
      originalPrice: Math.round(totalOriginalPrice * 100) / 100,
      discount,
      inStock: true,
    };
  });
};
