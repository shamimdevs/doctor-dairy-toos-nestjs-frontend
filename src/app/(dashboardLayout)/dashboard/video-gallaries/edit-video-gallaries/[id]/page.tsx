import EditVideoGallaries from "@/src/components/Dashboard/VideoGallary/VideoGallaries/EditVideoGallaries";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditVideoGallaries id={id} />
    </div>
  );
};

export default Page;
