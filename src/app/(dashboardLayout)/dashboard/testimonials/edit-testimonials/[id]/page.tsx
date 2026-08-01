import EditTestimonials from "@/src/components/Dashboard/Testimonials/EditTestimonials";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditTestimonials id={id} />
    </div>
  );
};

export default Page;
