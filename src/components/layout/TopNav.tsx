import React from 'react';
import { Link } from 'react-router-dom';
import { NAV, NavItem } from '@/config/nav';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';

function ItemLink({ item }: { item: NavItem }) {
  if (item.external && item.href) {
    return <a className="px-3 py-2 hover:text-bfo-gold" href={item.href} target="_blank" rel="noreferrer">{item.label}</a>;
  }
  if (item.href) {
    return <Link className="px-3 py-2 hover:text-bfo-gold" to={item.href}>{item.label}</Link>;
  }
  return <span className="px-3 py-2">{item.label}</span>;
}

function DropDown({ root }: { root: NavItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-2 inline-flex items-center hover:text-bfo-gold">
        {root.label}<ChevronDown className="ml-1 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[220px]">
        {root.children?.map((c) => {
          if (c.children?.length) {
            return (
              <DropdownMenuSub key={c.label}>
                <DropdownMenuSubTrigger>{c.label}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {c.children.map((g) => (
                      <DropdownMenuItem key={g.label} asChild>
                        {g.href
                          ? <Link to={g.href}>{g.label}</Link>
                          : <span>{g.label}</span>}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          }
          return (
            <DropdownMenuItem key={c.label} asChild>
              {c.href ? <Link to={c.href}>{c.label}</Link> : <span>{c.label}</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TopNav() {
  return (
    <div className="sticky top-[56px] z-40 bg-bfo-black text-bfo-gold border-y border-bfo-gold bfo-no-blur">
      <div className="mx-auto h-10 px-4 sm:px-6 lg:px-8 flex items-center">
        <nav className="flex items-center gap-2 text-white">
          {NAV.map((item) => item.children?.length
            ? <DropDown key={item.label} root={item} />
            : <ItemLink key={item.label} item={item} />
          )}
        </nav>
      </div>
    </div>
  );
}