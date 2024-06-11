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
					<DropdownMenuItem asChild>
						<Link className="font-medium" href="/anime">
							Anime
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link className="font-medium" href="/manga">
							Manga
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link className="font-medium" href="/people">
							People
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link className="font-medium" href="/character">
							Character
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function DesktopNav() {
	return (
		<>
			<div className="hidden items-center gap-2 md:flex">
				<Button variant="ghost" asChild>
					<Link className="font-bold" href="/anime">
						Anime
					</Link>
				</Button>
				<Button variant="ghost" asChild>
					<Link className="font-bold" href="/manga">
						Manga
					</Link>
				</Button>
				<Button variant="ghost" asChild>
					<Link className="font-bold" href="/character">
						Character
					</Link>
				</Button>
				<Button variant="ghost" asChild>
					<Link className="font-bold" href="/people">
						People
					</Link>
				</Button>
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
