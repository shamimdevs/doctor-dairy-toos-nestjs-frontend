import EditBlogDetails from "@/src/components/Dashboard/Blog/BlogDetails/EditBlogDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditBlogDetails id={id} />
    </div>
  );
};

export default Page;
