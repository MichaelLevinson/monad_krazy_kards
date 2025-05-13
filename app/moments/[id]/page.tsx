import { Metadata } from 'next';
import { APP_URL } from '@/lib/constants';
import { getMomentById } from '@/lib/db';

type Props = {
  params: { id: string };
};

// Dynamic metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const momentId = Number(params.id);
  
  // Fetch moment data to use in metadata
  let title = 'Monad Moment';
  let description = 'Discover, share, and celebrate your journey on the Monad blockchain.';
  
  try {
    if (!isNaN(momentId)) {
      const moment = await getMomentById(momentId);
      
      if (moment) {
        title = `${moment.title} | Monad Moments`;
        description = moment.description;
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${APP_URL}/moments/${params.id}`,
      images: [
        {
          url: 'https://i.imgur.com/abc123.png', // Replace with actual image URL for OG cards
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://i.imgur.com/abc123.png'], // Replace with actual image URL
    },
  };
}

export default function MomentPage({ params }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-monad-primary text-center mb-8">
          Monad Moments
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            This is a sharable moment page. To view this moment, please open in Warpcast.
          </p>
          
          <div className="flex justify-center">
            <a
              href={`https://warpcast.com/~/moments/${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-monad-primary text-white px-4 py-2 rounded-md hover:bg-monad-secondary transition-colors"
            >
              View in Warpcast
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}