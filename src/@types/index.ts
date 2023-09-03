import type { DehydratedState } from '@tanstack/react-query';

export type RouteBase = {
  label: string;
  active?: boolean;
  icon: React.ElementType;
};

export type Route =
  | ({
      onClick: React.MouseEventHandler<HTMLElement>;
      href?: never;
    } & RouteBase)
  | ({
      href: string;
      onClick?: never;
    } & RouteBase);

export type DehydratedProps = {
  dehydratedState: DehydratedState;
};

export type Emoji = {
  native: string;
};
