import EditProducts from "@/src/components/Dashboard/Products/Product/EditProducts";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditProducts id={id} />
    </div>
  );
};

export default Page;
