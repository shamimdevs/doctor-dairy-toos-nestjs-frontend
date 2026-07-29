import EditProductCategory from "@/src/components/Dashboard/Products/ProductCategory/EditProductCategory";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditProductCategory id={id} />
    </div>
  );
};

export default Page;
