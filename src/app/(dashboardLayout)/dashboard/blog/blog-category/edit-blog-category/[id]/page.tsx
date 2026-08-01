import EditBlogCategory from "@/src/components/Blog/BlogCategory/EditBlogCategory";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditBlogCategory id={id} />
    </div>
  );
};

export default Page;
