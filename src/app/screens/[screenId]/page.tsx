import InteractiveScreenClient from '@/components/InteractiveScreenClient';
import { notFound } from 'next/navigation';

type InteractiveScreenPageProps = {
  params: {
    screenId: string;
  };
};

// Ensure proper component closure
const InteractiveScreenPage = async ({ params }: InteractiveScreenPageProps) => {
  // Add await for params
  const { screenId } = await params;
  const parsedId = parseInt(screenId, 10);

  if (isNaN(parsedId) || parsedId < 1) {
    notFound();
  }
  return <InteractiveScreenClient currentScreenIdProp={parsedId.toString()} />;
};

export default InteractiveScreenPage;
