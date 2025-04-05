import {
  CatchBoundary,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { ICreateRouter } from '@akashaorg/typings/lib/ui';
import PollPage from '../poll-page';
import PollFormPage from '../poll-form-page';
import NewsFeedPage from '../news-feed-page';

const POLL_EDITOR = 'Poll editor';
const POLLS = 'Polls';

const NEWS_FEED = 'AI News Feed';

const routes = {
  [POLL_EDITOR]: '/poll-editor',
  [POLLS]: '/polls',
  [NEWS_FEED]: '/news',
} as const;

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: () => <div>Not found</div>,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[POLLS], replace: true });
  },
});

const pollsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[POLLS],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'polls_reset'} errorComponent={() => <div>Not found</div>}>
        <PollPage />
      </CatchBoundary>
    );
  },
});

const pollEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[POLL_EDITOR],
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'polls_form_reset'}
        errorComponent={() => <div>Not found</div>}
      >
        <PollFormPage />
      </CatchBoundary>
    );
  },
});

const NewsFeedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[NEWS_FEED],
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'polls_form_reset'}
        errorComponent={() => <div>Not found</div>}
      >
        <NewsFeedPage />
      </CatchBoundary>
    );
  },
});

const routeTree = rootRoute.addChildren([defaultRoute, pollsRoute, pollEditorRoute, NewsFeedRoute]);

const router = ({ baseRouteName, apolloClient }: ICreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,
    defaultErrorComponent: ({ error }) => <div>Error: {error.message}</div>,
  });

export { routes, router, POLL_EDITOR, POLLS, NEWS_FEED };
