import EditVideoGallaryCategory from "@/src/components/Dashboard/VideoGallary/VideoGallaryCategory/EditVideoGallaryCategory";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditVideoGallaryCategory id={id} />
    </div>
  );
};

export default Page;
