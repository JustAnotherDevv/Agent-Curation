import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  LogoTypeSource,
  MenuItemType,
} from '@akashaorg/typings/lib/ui';
import { POLLS, NEWS_FEED, routes } from './components/app-routes';
import { SquareCheck } from 'lucide-react';
import getSDK from '@akashaorg/core-sdk';
import { getComposeClient } from './api';
import { POLL_EDITOR } from './components/app-routes';

/**
 * Changes in this file requires a full reload in the browser!
 */

const SidebarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="w-5 h-5 stroke-secondaryLight dark:stroke-secondaryDark"
  >
    <rect x="20" y="30" width="60" height="50" rx="8" fill="#2c3e50" />

    <line
      x1="50"
      y1="30"
      x2="50"
      y2="15"
      stroke="#2c3e50"
      stroke-width="3"
      stroke-linecap="round"
    />
    <circle cx="50" cy="12" r="4" fill="#2c3e50" />

    <rect x="32" y="45" width="12" height="8" rx="2" fill="white" />
    <rect x="56" y="45" width="12" height="8" rx="2" fill="white" />

    <rect x="35" y="65" width="30" height="5" rx="2" fill="white" />
  </svg>
);

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
    title:
      ' Bitcoin traders prepare for rally to $100K as ‘decoupling’ and ‘gold leads BTC’ trend takes shape ',
    link: 'https://cointelegraph.com/news/bitcoin-traders-prepare-for-rally-to-100-k-as-decoupling-and-gold-leads-btc-trend-takes-shape?utm_source=rss_feed&utm_medium=rss&utm_campaign=rss_partner_inbound',
    tags: ['Bitcoin', 'gold', 'decoupling', 'market analysis', 'trading strategies'],
    summary:
      'Bitcoin traders are preparing for a potential rally to $100,000 as the cryptocurrency shows signs of decoupling from the US stock market and gold. The relationship between gold and Bitcoin is being closely monitored, with some analysts predicting a strong price recovery for Bitcoin based on historical trends.',
  },
];

export const initialize = () => {
  const sdk = getSDK();
  const compose = getComposeClient();
  const resources = compose.resources;
  resources.forEach(res => sdk.services.ceramic.setExtraResource(res));
};

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => {
  return {
    rootComponent: () => import('./components'),
    mountsIn: opts.layoutSlots?.applicationSlotId as string,
    menuItems: {
      label: 'Curation Agent',
      logo: { type: LogoTypeSource.ICON, value: <SidebarIcon /> },
      area: [MenuItemAreaType.UserAppArea],
      subRoutes: [
        {
          label: NEWS_FEED,
          index: 0,
          route: routes[NEWS_FEED],
          type: MenuItemType.Internal,
        },
        {
          label: POLLS,
          index: 0,
          route: routes[POLLS],
          type: MenuItemType.Internal,
        },
        {
          label: POLL_EDITOR,
          index: 1,
          route: routes[POLL_EDITOR],
          type: MenuItemType.Internal,
        },
      ],
    },

    contentBlocks: [
      {
        propertyType: 'poll-block',
        icon: <SquareCheck />,
        displayName: 'Poll block',
        rootComponent: () => import('./extensions/poll-block'),
      },
    ],
  };
};
