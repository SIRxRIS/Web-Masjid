"use client";

import * as React from "react";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type IconComponent = React.ComponentType<any>;

interface NavMainItem {
  title: string;
  url: string;
  icon: IconComponent;
  chevronIcon?: IconComponent;
  children?: NavMainItem[];
}

export type { NavMainItem };

export function NavMain({
  items,
  className,
}: {
  items: NavMainItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = React.useState<{ [key: string]: boolean }>(
    {}
  );

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.children ? (
                <Collapsible
                  defaultOpen
                  className="group/collapsible"
                  open={openItems[item.title]}
                  onOpenChange={(isOpen) =>
                    setOpenItems((prev) => ({ ...prev, [item.title]: isOpen }))
                  }
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon className="size-4" />}
                          <span>{item.title}</span>
                        </div>
                        <IconChevronRight
                          className={`size-4 transition-transform duration-200 ${
                            openItems[item.title] ? "rotate-90" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((child, childIndex) => (
                          <SidebarMenuSubItem key={childIndex}>
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === child.url}
                              tooltip={child.title}
                            >
                              <Link
                                href={child.url}
                                className="flex items-center gap-2"
                              >
                                {child.icon && (
                                  <child.icon className="size-4" />
                                )}
                                <span>{child.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
