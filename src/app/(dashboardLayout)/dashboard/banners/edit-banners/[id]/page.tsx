import EditBanners from "@/src/components/Dashboard/Banners/EditBanners";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditBanners id={id} />
    </div>
  );
};

export default Page;
