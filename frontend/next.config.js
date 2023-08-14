/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		BASE_API_URL: "https://localhost:7024",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
		],
	},
};

module.exports = nextConfig;
