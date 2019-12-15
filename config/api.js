module.exports = {
	server: {
		port: 3000
	},
	jwt: {
		sharedSecret: process.env.JWT_SHARED_SECRET
	}
}
