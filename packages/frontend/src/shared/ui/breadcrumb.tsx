import { forwardRef, Fragment } from 'preact/compat';
import { Breadcrumb, type SystemStyleObject } from "@chakra-ui/react";
import type { ComponentChild } from 'preact';

export interface BreadcrumbRootProps extends Breadcrumb.RootProps {
  separator?: ComponentChild;
  separatorGap?: SystemStyleObject["gap"];
}

export const BreadcrumbRoot = forwardRef<HTMLDivElement, BreadcrumbRootProps>(
  function BreadcrumbRoot(props, ref) {
    const { separator, separatorGap, children, ...rest } = props;

    const validChildren = (children instanceof Array ? children : [children])
      .filter((child): child is ComponentChild => child != null);

    return (
      <Breadcrumb.Root ref={ref as never} {...rest}>
        <Breadcrumb.List gap={separatorGap}>
          {validChildren.map((child, index) => {
            const last = index === validChildren.length - 1;
            return (
              <Fragment key={index}>
                <Breadcrumb.Item>{child}</Breadcrumb.Item>
                {!last && <Breadcrumb.Separator>{separator}</Breadcrumb.Separator>}
              </Fragment>
            );
          })}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    );
  }
);

export const BreadcrumbLink = Breadcrumb.Link;
export const BreadcrumbCurrentLink = Breadcrumb.CurrentLink;
export const BreadcrumbEllipsis = Breadcrumb.Ellipsis;
