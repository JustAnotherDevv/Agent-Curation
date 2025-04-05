import { Button } from '@/components/ui/button';
import { FeedCTA } from '@/components/ui/feed-cta';
import { Stack } from '@/components/ui/stack';
import { PollCard } from '@/components/poll-card';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { getAllPollsWithVotes } from '@/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from './ui/card';
import { Typography } from './ui/typography';
import { getOptionPercentage } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Separator } from './ui/separator';
import { Clock, ExternalLink, Tag, TrendingUp, ArrowRight, Calendar, Eye } from 'lucide-react';

const scrapedNewsSentiment = [
  {
    title: ' SEC paints &#039;a distorted picture&#039; of USD-stablecoin market — Crenshaw ',
    link: 'https://cointelegraph.com/news/us-sec-stablecoin-guidelines-challenged-caroline-crenshaw?utm_source=rss_feed&utm_medium=rss&utm_campaign=rss_partner_inbound',
    tags: [
      'SEC',
      'stablecoin market',
      'cryptocurrency regulation',
      'USD-stablecoins',
      'crypto industry',
    ],
    summary:
      "SEC Commissioner Caroline Crenshaw criticizes the SEC for downplaying risks and misrepresenting the US stablecoin market in its new guidelines, while many in the crypto industry see the decision as a positive step. The SEC's guidelines exempt certain stablecoins from transaction reporting requirements, but Crenshaw disagrees with the analysis and highlights the risks associated with stablecoins, especially during market downturns.",
  },
  {
    title: ` Bitcoin traders prepare for rally to $100K as 'decoupling' and 'gold leads BTC' trend takes shape `,
    link: 'https://cointelegraph.com/news/bitcoin-traders-prepare-for-rally-to-100-k-as-decoupling-and-gold-leads-btc-trend-takes-shape?utm_source=rss_feed&utm_medium=rss&utm_campaign=rss_partner_inbound',
    tags: ['Bitcoin', 'gold', 'decoupling', 'market analysis', 'trading strategies'],
    summary:
      'Bitcoin traders are preparing for a potential rally to $100,000 as the cryptocurrency shows signs of decoupling from the US stock market and gold. The relationship between gold and Bitcoin is being closely monitored, with some analysts predicting a strong price recovery for Bitcoin based on historical trends.',
  },
];

const enhancedNewsData = [
  {
    ...scrapedNewsSentiment[0],
    publisher: 'CoinTelegraph',
    publisherLogo: 'https://github.com/cointelegraph.png',
    publishDate: 'April 3, 2025',
    readTime: '4 min read',
    sentiment: 'mixed',
    trending: true,
    viewCount: '3.2k',
  },
  {
    ...scrapedNewsSentiment[1],
    publisher: 'CoinTelegraph',
    publisherLogo: 'https://github.com/cointelegraph.png',
    publishDate: 'April 2, 2025',
    readTime: '5 min read',
    sentiment: 'bullish',
    trending: true,
    viewCount: '8.7k',
  },
  {
    title: 'DeFi Protocol Reports Record TVL Despite Market Uncertainty',
    link: 'https://example.com/defi-tvl-record',
    publisher: 'DeFi Pulse',
    publisherLogo: 'https://github.com/defipulse.png',
    publishDate: 'April 1, 2025',
    readTime: '3 min read',
    tags: ['DeFi', 'TVL', 'protocols', 'yield farming', 'liquidity'],
    summary:
      'Despite ongoing market volatility, a leading DeFi protocol has reported a record-breaking Total Value Locked (TVL) of $4.2 billion. Analysts attribute this growth to innovative staking mechanisms and increased institutional interest in decentralized finance solutions.',
    sentiment: 'bullish',
    trending: false,
    viewCount: '1.5k',
  },
  {
    title: 'Regulatory Clarity Emerges for NFT Markets in European Union',
    link: 'https://example.com/eu-nft-regulation',
    publisher: 'NFT Insider',
    publisherLogo: 'https://github.com/nftinsider.png',
    publishDate: 'March 31, 2025',
    readTime: '6 min read',
    tags: ['NFTs', 'regulation', 'European Union', 'digital assets', 'compliance'],
    summary:
      'The European Union has finalized a comprehensive framework for NFT markets, providing much-needed regulatory clarity. The new guidelines establish clear classifications for different types of non-fungible tokens and outline compliance requirements for creators, marketplaces, and collectors.',
    sentiment: 'neutral',
    trending: false,
    viewCount: '2.8k',
  },
];

const NewsCard = ({ article, index }) => {
  const cleanTitle = title => {
    return title.replace(/&#039;/g, "'").replace(/&amp;/g, '&');
  };

  const getSentimentStyles = sentiment => {
    switch (sentiment) {
      case 'bullish':
        return 'border-l-4 border-l-green-500';
      case 'bearish':
        return 'border-l-4 border-l-destructive';
      case 'mixed':
        return 'border-l-4 border-l-orange-500';
      default:
        return 'border-l-4 border-l-primary';
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg my-6 ${getSentimentStyles(
        article.sentiment,
      )}`}
    >
      <div className="flex items-start p-4 pb-2">
        <Avatar className="h-8 w-8 mr-3 mt-1">
          <img src={article.publisherLogo} alt={article.publisher} />
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Typography variant="sm" className="font-medium">
                {article.publisher}
              </Typography>
              <span className="mx-2 text-muted-foreground">•</span>
              <div className="flex items-center text-muted-foreground text-xs">
                <Calendar size={12} className="mr-1" />
                {article.publishDate}
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                {article.readTime}
              </div>
              {article.trending && (
                <Badge variant="secondary" className="px-2 py-0 h-5 text-xs">
                  <TrendingUp size={10} className="mr-1" /> Trending
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-lg font-bold mt-2 mb-2">{cleanTitle(article.title)}</CardTitle>
        </div>
      </div>

      <CardContent>
        <Typography variant="sm" className="text-muted-foreground mb-4 leading-relaxed">
          {article.summary}
        </Typography>

        <div className="flex items-center gap-2 mt-4">
          <Tag size={14} className="text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="cursor-pointer transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary flex items-center gap-1 text-sm font-medium hover:underline group transition-all"
        >
          Read Full Article{' '}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const NewsFeedPage = () => {
  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const { navigateToModal, getCorePlugins } = useRootComponentProps();

  const [isLoadingPolls, setIsLoadingPolls] = useState(false);
  const [allPollsWithVotes, setAllPollsWithVotes] =
    useState<Awaited<ReturnType<typeof getAllPollsWithVotes>>['data']>();

  const navigate = useNavigate();

  const handleEditorPlaceholderClick = useCallback(() => {
    if (!authenticatedDID) {
      alert('Please login to create a poll');
      navigateToModal({
        name: 'login',
        redrectTo: location.pathname,
      });
      return;
    }
    getCorePlugins().routing.navigateTo({
      appName: '@akashaorg/app-antenna',
      getNavigationUrl: () => '/editor',
    });
  }, [authenticatedDID, navigate]);

  useEffect(() => {
    const getPollsWithVotes = async () => {
      setIsLoadingPolls(true);
      const res = await getAllPollsWithVotes();
      setIsLoadingPolls(false);
      if (res.error) {
        return;
      }
      setAllPollsWithVotes(res.data);
    };
    getPollsWithVotes();
  }, []);

  return (
    <Stack spacing={4}>
      <div value="news" className="w-full space-y-4">
        <Card className="p-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Crypto News Digest</h2>
            <p className="text-muted-foreground max-w-3xl">
              Stay informed with curated summaries from the crypto universe. Our AI analyzes the
              latest developments, trends, and market insights to keep you ahead of the curve.
            </p>

            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="px-3 py-1">
                <TrendingUp size={14} className="mr-1" /> Market Updates
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                Verified Sources
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Daily Summaries
              </Badge>
            </div>
          </div>
        </Card>

        <div className="space-y-1">
          {enhancedNewsData.map((article, index) => (
            <NewsCard key={index} article={article} index={index} />
          ))}
        </div>
      </div>
    </Stack>
  );
};

export default NewsFeedPage;
