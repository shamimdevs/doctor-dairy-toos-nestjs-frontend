import EditBlogPost from "@/src/components/Dashboard/Blog/BlogPost/EditBlogPost";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditBlogPost id={id} />
    </div>
  );
};

export default Page;
