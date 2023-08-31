/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		BASE_API_URL: process.env.BASE_API_URL,
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
