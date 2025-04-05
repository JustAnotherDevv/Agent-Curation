import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  LogoTypeSource,
  MenuItemType,
} from '@akashaorg/typings/lib/ui';
import { POLLS, routes } from './components/app-routes';
import { SquareCheck } from 'lucide-react';
import getSDK from '@akashaorg/core-sdk';
import { getComposeClient } from './api';
import { POLL_EDITOR } from './components/app-routes';

/**
 * Changes in this file requires a full reload in the browser!
 */

const SidebarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5 stroke-secondaryLight dark:stroke-secondaryDark">
  <rect x="20" y="30" width="60" height="50" rx="8" fill="#2c3e50"/>
  
  <line x1="50" y1="30" x2="50" y2="15" stroke="#2c3e50" stroke-width="3" stroke-linecap="round"/>
  <circle cx="50" cy="12" r="4" fill="#2c3e50"/>
  
  <rect x="32" y="45" width="12" height="8" rx="2" fill="white"/>
  <rect x="56" y="45" width="12" height="8" rx="2" fill="white"/>
  
  <rect x="35" y="65" width="30" height="5" rx="2" fill="white"/>
</svg>
);

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
      label: 'Extension Devkit',
      logo: { type: LogoTypeSource.ICON, value: <SidebarIcon /> },
      area: [MenuItemAreaType.UserAppArea],
      subRoutes: [
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
