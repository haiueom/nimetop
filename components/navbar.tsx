"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Github, Menu } from "lucide-react";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/themeToggle";
import { usePathname } from "next/navigation";

const links = [
	{ href: "/anime", label: "Anime" },
	{ href: "/manga", label: "Manga" },
	{ href: "/people", label: "People" },
	{ href: "/character", label: "Character" },
];

function MobileNav() {
	return (
		<div className="flex items-center gap-2 md:hidden">
			<Button variant="secondary" size="icon" asChild>
				<Link href="https://github.com/haiueom/nimetop" target="_blank">
					<Github />
				</Link>
			</Button>
			<ModeToggle />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon">
						<Menu />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{links.map(
						(
							item: { href: string; label: string },
							index: number,
						) => (
							<DropdownMenuItem asChild key={index}>
								<Link className="font-medium" href={item.href}>
									{item.label}
								</Link>
							</DropdownMenuItem>
						),
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function DesktopNav() {
	const pathname = usePathname();
	return (
		<>
			<div className="hidden items-center gap-2 md:flex">
				{links.map(
					(item: { href: string; label: string }, index: number) => (
						<Button
							variant={
								item.href === pathname ? "secondary" : "ghost"
							}
							asChild
							key={index}
						>
							<Link className="font-bold" href={item.href}>
								{item.label}
							</Link>
						</Button>
					),
				)}
			</div>
			<div className="hidden items-center gap-2 md:flex">
				<Button variant="default" asChild>
					<Link
						className="font-bold"
						href="https://github.com/haiueom/nimetop"
						target="_blank"
					>
						Github <ArrowUpRight className="pl-1" />
					</Link>
				</Button>
				<ModeToggle />
			</div>
		</>
	);
}

export default function Navbar() {
	return (
		<header className="w-full">
			<nav className="flex items-center justify-between">
				<div>
					<Button variant="default" asChild>
						<Link
							className="text-xl font-bold text-primary-foreground"
							href="/"
						>
							NimeTop
						</Link>
					</Button>
				</div>
				<MobileNav />
				<DesktopNav />
			</nav>
		</header>
	);
}
