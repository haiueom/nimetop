import type { Metadata } from "next";
import "@/app/globals.css";
import { Poppins as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Wrapper from "@/components/wrapper";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/themeProvider";

const fontSans = FontSans({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-sans",
	display: "swap",
	style: "normal",
});

export const metadata: Metadata = {
	title: "Nimetop by Haiueom",
	description: "Ranking based on MAL",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"flex min-h-screen flex-col items-center bg-background font-sans antialiased",
					fontSans.variable,
					process.env.NODE_ENV === "development" && "debug-screens",
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<Wrapper>
						<Navbar />
						{children}
						<Footer />
					</Wrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
