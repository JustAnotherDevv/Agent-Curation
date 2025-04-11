import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  ArrowRight,
  Tag,
  Shield,
  AlertTriangle,
  ThumbsUp,
  MessageSquare,
  RotateCcw,
  Settings,
  Sparkles,
  Filter,
} from 'lucide-react';

// Sample feed data with filter properties
const feedData = [
  {
    id: 1,
    type: 'news',
    title: 'SEC Approves First Spot Ether ETF Applications',
    content:
      'The U.S. Securities and Exchange Commission has approved the first spot Ether ETF applications, marking a significant milestone for cryptocurrency adoption in traditional finance. Major financial institutions are preparing to launch their ETF products in the coming weeks.',
    author: 'CryptoNewsDaily',
    authorAvatar: 'https://github.com/cryptonewsdaily.png',
    publishDate: 'April 3, 2025',
    readTime: '5 min read',
    tags: ['ETF', 'Ethereum', 'SEC', 'Regulation'],
    viewCount: '12.4k',
    likes: 876,
    comments: 234,
    sentiment: 'bullish',
    trending: true,
    sensitive: false,
    contentRating: 'all',
    sourceReliability: 'high',
    link: 'https://example.com/sec-ether-etf',
  },
  {
    id: 2,
    type: 'post',
    title: "Why I'm Bearish on Layer 2 Solutions",
    content:
      "I've been analyzing Layer 2 scaling solutions for Ethereum, and I'm increasingly concerned about centralization issues. Most L2s rely on a small number of sequencers, creating potential points of failure. Additionally, the economic models of several prominent L2s seem unsustainable once token incentives dry up.",
    author: 'CryptoSkeptic',
    authorAvatar: 'https://github.com/cryptoskeptic.png',
    publishDate: 'April 2, 2025',
    readTime: '7 min read',
    tags: ['Layer 2', 'Ethereum', 'Scaling', 'Analysis'],
    viewCount: '5.1k',
    likes: 412,
    comments: 189,
    sentiment: 'bearish',
    trending: false,
    sensitive: false,
    contentRating: 'all',
    sourceReliability: 'medium',
    link: 'https://example.com/bearish-l2',
  },
  {
    id: 3,
    type: 'news',
    title: 'Major DeFi Hack Results in $150M Loss',
    content:
      "A popular DeFi protocol has been exploited, resulting in approximately $150 million in stolen funds. The attack appears to be related to a vulnerability in the smart contract's re-entrancy protection. The protocol has paused all operations and is working with security firms to investigate.",
    author: 'DeFi Alert',
    authorAvatar: 'https://github.com/defialert.png',
    publishDate: 'April 1, 2025',
    readTime: '4 min read',
    tags: ['DeFi', 'Security', 'Hack', 'Smart Contracts'],
    viewCount: '22.8k',
    likes: 513,
    comments: 342,
    sentiment: 'bearish',
    trending: true,
    sensitive: true,
    contentRating: 'mature',
    sourceReliability: 'high',
    link: 'https://example.com/defi-hack',
  },
  {
    id: 4,
    type: 'post',
    title: 'Unpopular Opinion: Memecoins Are Good For Crypto',
    content:
      'While many "serious" crypto investors dismiss memecoins, I believe they play a crucial role in onboarding new users to the ecosystem. Memecoins often serve as a gateway that introduces people to wallets, exchanges, and basic blockchain concepts. The playful nature makes crypto less intimidating for newcomers.',
    author: 'CryptoThoughts',
    authorAvatar: 'https://github.com/cryptothoughts.png',
    publishDate: 'March 31, 2025',
    readTime: '6 min read',
    tags: ['Memecoins', 'Adoption', 'Opinion'],
    viewCount: '8.3k',
    likes: 1243,
    comments: 567,
    sentiment: 'neutral',
    trending: false,
    sensitive: false,
    contentRating: 'all',
    sourceReliability: 'medium',
    link: 'https://example.com/memecoins-opinion',
  },
  {
    id: 5,
    type: 'news',
    title: 'Central Bank Digital Currencies Face Privacy Concerns',
    content:
      'A new report highlights growing privacy concerns around Central Bank Digital Currencies (CBDCs). Civil liberties groups argue that current CBDC designs could enable unprecedented financial surveillance. Meanwhile, central banks claim privacy safeguards will be incorporated into final implementations.',
    author: 'PolicyUpdate',
    authorAvatar: 'https://github.com/policyupdate.png',
    publishDate: 'March 30, 2025',
    readTime: '8 min read',
    tags: ['CBDC', 'Privacy', 'Central Banks', 'Policy'],
    viewCount: '7.6k',
    likes: 624,
    comments: 213,
    sentiment: 'bearish',
    trending: false,
    sensitive: true,
    contentRating: 'mature',
    sourceReliability: 'high',
    link: 'https://example.com/cbdc-privacy',
  },
  {
    id: 6,
    type: 'post',
    title: 'Just bought my first full Bitcoin!',
    content: `After DCAing for three years, I finally reached my goal of owning a full Bitcoin! I know it might not seem like much to some of you whales, but for me this represents years of patience and discipline. Never thought I'd get here when I started my journey.`,
    author: 'BitcoinBeliever',
    authorAvatar: 'https://github.com/bitcoinbeliever.png',
    publishDate: 'March 29, 2025',
    readTime: '2 min read',
    tags: ['Bitcoin', 'Personal', 'Milestone'],
    viewCount: '3.2k',
    likes: 1876,
    comments: 342,
    sentiment: 'bullish',
    trending: false,
    sensitive: false,
    contentRating: 'all',
    sourceReliability: 'low',
    link: 'https://example.com/first-bitcoin',
  },
];

// AI-generated content filter suggestions
const aiSuggestedFilters = [
  {
    id: 'bearish',
    name: 'Bearish Content',
    description: 'Hide posts with negative market sentiment',
    applied: true,
  },
  {
    id: 'sensitive',
    name: 'Sensitive Topics',
    description: 'Content related to hacks, scams, or losses',
    applied: true,
  },
  {
    id: 'low-reliability',
    name: 'Low Reliability Sources',
    description: 'Content from unverified or new sources',
    applied: false,
  },
  {
    id: 'mature',
    name: 'Mature Content',
    description: 'Content with adult themes or strong language',
    applied: true,
  },
  {
    id: 'political',
    name: 'Political Content',
    description: 'Content focused on politics or regulation',
    applied: false,
  },
];

const FilterBadge = ({ filter, onToggle, applied }) => {
  return (
    <Badge
      variant={applied ? 'default' : 'outline'}
      className="cursor-pointer flex items-center gap-1 px-3 py-1"
      onClick={() => onToggle(filter.id)}
    >
      {applied ? <Shield size={12} className="mr-1" /> : <Filter size={12} className="mr-1" />}
      {filter.name}
    </Badge>
  );
};

const FeedItem = ({ item, unblurredItems, toggleBlur }) => {
  const isBlurred = !unblurredItems.includes(item.id);
  const shouldBlur =
    item.sensitive || item.sentiment === 'bearish' || item.contentRating === 'mature';

  // Get sentiment indicator classes based on sentiment
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
      className={`overflow-hidden transition-all mb-4 ${getSentimentStyles(item.sentiment)} ${
        shouldBlur && isBlurred ? 'relative' : ''
      }`}
    >
      <div className="flex items-start p-4 pb-2">
        <Avatar className="h-8 w-8 mr-3 mt-1">
          <img src={item.authorAvatar || 'https://github.com/placeholder.png'} alt={item.author} />
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Typography className="font-medium text-sm">{item.author}</Typography>
              <span className="mx-2 text-muted-foreground">•</span>
              <div className="flex items-center text-muted-foreground text-xs">
                <Calendar size={12} className="mr-1" />
                {item.publishDate}
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                {item.readTime}
              </div>
              <div className="flex items-center">
                <Eye size={12} className="mr-1" />
                {item.viewCount}
              </div>
              {item.trending && (
                <Badge variant="secondary" className="px-2 py-0 h-5 text-xs">
                  <TrendingUp size={10} className="mr-1" /> Trending
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-lg font-bold mt-2 mb-2">{item.title}</CardTitle>
        </div>
      </div>

      <CardContent>
        {shouldBlur && isBlurred ? (
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-md bg-card/50 flex flex-col items-center justify-center z-10 p-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mb-3" />
              <Typography className="font-medium text-center mb-1">
                {item.sensitive
                  ? 'Sensitive Content'
                  : item.sentiment === 'bearish'
                  ? 'Bearish Content'
                  : 'Mature Content'}
              </Typography>
              <Typography className="text-muted-foreground text-sm text-center mb-4">
                This content has been hidden based on your filter preferences.
              </Typography>
              <Button onClick={() => toggleBlur(item.id)} variant="outline" size="sm">
                Show Anyway
              </Button>
            </div>
            <Typography className="text-muted-foreground mb-4 leading-relaxed text-sm blur-md select-none">
              {item.content}
            </Typography>
          </div>
        ) : (
          <Typography className="text-muted-foreground mb-4 leading-relaxed text-sm">
            {item.content}
          </Typography>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Tag size={14} className="text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="cursor-pointer transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary flex items-center gap-1 text-sm font-medium hover:underline group transition-all"
        >
          Read Full {item.type === 'news' ? 'Article' : 'Post'}{' '}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 flex items-center gap-1 text-sm text-muted-foreground"
          >
            <ThumbsUp size={14} /> {item.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 flex items-center gap-1 text-sm text-muted-foreground"
          >
            <MessageSquare size={14} /> {item.comments}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const CuratedPage = () => {
  const [filters, setFilters] = useState(aiSuggestedFilters);
  const [unblurredItems, setUnblurredItems] = useState([]);
  const [contentSensitivity, setContentSensitivity] = useState(70);

  const toggleFilter = filterId => {
    setFilters(
      filters.map(filter =>
        filter.id === filterId ? { ...filter, applied: !filter.applied } : filter,
      ),
    );

    // Reset unblurred items when changing filters
    setUnblurredItems([]);
  };

  const toggleBlur = itemId => {
    if (unblurredItems.includes(itemId)) {
      setUnblurredItems(unblurredItems.filter(id => id !== itemId));
    } else {
      setUnblurredItems([...unblurredItems, itemId]);
    }
  };

  const resetFilters = () => {
    setFilters(aiSuggestedFilters);
    setUnblurredItems([]);
    setContentSensitivity(70);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              <CardTitle>AI-Managed Content Filters</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 gap-1">
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Typography className="text-sm font-medium">Suggested Filters</Typography>
                <Typography className="text-xs text-muted-foreground">
                  Personalized based on your preferences
                </Typography>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {filters.map(filter => (
                  <FilterBadge
                    key={filter.id}
                    filter={filter}
                    applied={filter.applied}
                    onToggle={toggleFilter}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Typography className="text-sm font-medium">Content Sensitivity Level</Typography>
                <Typography className="text-sm font-medium">{contentSensitivity}%</Typography>
              </div>
              <Slider
                defaultValue={[contentSensitivity]}
                max={100}
                step={10}
                onValueChange={value => setContentSensitivity(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Show Everything</span>
                <span>Maximum Filtering</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {/* <Switch id="auto-filter" defaultChecked /> */}
                <label htmlFor="auto-filter" className="text-sm cursor-pointer">
                  AI auto-updating filters
                </label>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Settings size={14} />
                Advanced Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-1">
        {feedData.map(item => (
          <FeedItem
            key={item.id}
            item={item}
            unblurredItems={unblurredItems}
            toggleBlur={toggleBlur}
          />
        ))}
      </div>
    </div>
  );
};

export default CuratedPage;
