import EditPurchase from "@/src/components/Dashboard/Purchases/EditPurchase";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditPurchase id={id} />
    </div>
  );
};

export default Page;
