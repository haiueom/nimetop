export default function Wrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex w-full max-w-4xl flex-col items-center space-y-10 px-4 py-6">
			{children}
		</div>
	);
}
