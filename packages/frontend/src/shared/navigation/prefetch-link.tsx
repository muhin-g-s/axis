import { Link, type BaseLocationHook, type LinkProps } from 'wouter-preact';
import { useRef } from 'preact/hooks';
import { dynamicRoutesMap, RouteNames } from './navigation';
import type { BrowserLocationHook } from 'wouter-preact/use-browser-location';

export type PrefetchLinkProps<
  H extends BaseLocationHook = BrowserLocationHook
> =
  LinkProps<H>
  & { to?: never }
  & { href: string }
  & { 
    onMouseEnter?: (e: MouseEvent) => void;
  };

export function PrefetchLink<H extends BaseLocationHook = BrowserLocationHook>(
  { href, children, onMouseEnter, ...rest }: PrefetchLinkProps<H>
) {
  const loadedRef = useRef(false);

  const onMouseEnterHandler = (e: MouseEvent) => {
    if (!loadedRef.current){
       loadedRef.current = true;

    if (href in dynamicRoutesMap) {
      const loader = dynamicRoutesMap[href as RouteNames];
      loader?.();
    }
    };
    onMouseEnter?.(e);
  };

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnterHandler}
      {...rest}
    >
      {children}
    </Link>
  );
}
