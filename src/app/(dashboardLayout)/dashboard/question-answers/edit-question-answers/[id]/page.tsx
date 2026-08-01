import EditQuestionAnswer from "@/src/components/Dashboard/QuestionAnswer/EditQuestionAnswer";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditQuestionAnswer id={id} />
    </div>
  );
};

export default Page;
