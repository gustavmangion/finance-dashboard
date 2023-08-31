import Image from "next/image";

export default function Footer() {
	return (
		<div className="footer">
			<a href="https://github.com/gustavmangion" target="_blank">
				<Image
					alt="Github Logo"
					src="/github.png"
					width={0}
					height={0}
					sizes="100%"
					style={{ width: "auto", height: "100%" }}
				/>
				Gustav Mangion
			</a>
		</div>
	);
}
