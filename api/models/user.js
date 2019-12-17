require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const sql = store.mysql
const MYSQL_AES_KEY = config.data.mysql.aesSecret

// constructor
const User = function(user) {
	this.email = user.email
	this.username = user.username
    this.password = user.password
    //this.active = user.active
    this.first_name = user.first_name
    this.last_name = user.last_name
}

// User.create = (newUser, result) => {
// 	sql.query('INSERT INTO users SET ?', newUser, (err, res) => {
// 		if (err) {
// 			logger.error('Unable to insert new user: ', err)
// 			result(err, null)
// 			return
// 		}

// 		logger.debug('Inserted new user: ', {
// 			id: res.insertId,
// 			...newUser
// 		})
// 		result(null, { id: res.insertId, ...newUser })
// 	})
// }

User.findById = (userId, result) => {
	sql.query(`SELECT AES_DECRYPT(password, '${MYSQL_AES_KEY}') AS password_text, * FROM users WHERE id = ${userId}`, (err, res) => {
		if (err) {
			logger.error('Unable to find user by id: ', err)
			result(err, null)
			return
		}

		if (res.length) {
			logger.debug('Found user by id: ', res[0])
			res[0].password = res[0].password_text
			result(null, res[0])
			return
		}

		// not found User with the id
		result({ kind: 'not_found' }, null)
	})
}

User.findByCredentials = (username, password,result) => {
	sql.query(`SELECT *  FROM users WHERE username = '${username}' AND AES_DECRYPT(password, '${MYSQL_AES_KEY}') = '${password}'`, (err, res) => {
		if (err) {
			logger.error('Unable to find user by username: ', err)
			result(err, null)
			return
		}

		if (res.length) {
			logger.info('Found user by username: ', res[0])
			result(null, res[0])
			return
		}

		// not found User with the credentials
		result({ kind: 'not_found' }, null)
	})
}

User.getAll = result => {
	sql.query('SELECT * FROM users', (err, res) => {
		if (err) {
			logger.error('Unable to get all users: ', err)
			result(null, err)
			return
		}

		console.log('Found users: ', res)
		result(null, res)
	})
}

// User.updateById = (id, user, result) => {
// 	sql.query(
// 		'UPDATE users SET email = ?, name = ?, active = ? WHERE id = ?',
// 		[user.email, user.name, user.active, id],
// 		(err, res) => {
// 			if (err) {
// 				logger.error('Unable to update user by id: ', err)
// 				result(null, err)
// 				return
// 			}

// 			if (res.affectedRows == 0) {
// 				// not found Customer with the id
// 				result({ kind: 'not_found' }, null)
// 				return
// 			}

// 			log.debug('Updated user: ', { id: id, ...user })
// 			result(null, { id: id, ...user })
// 		}
// 	)
// }

// User.remove = (id, result) => {
// 	sql.query('DELETE FROM users WHERE id = ?', id, (err, res) => {
// 		if (err) {
// 			logger.error('Unable to remove user: ', err)
// 			result(null, err)
// 			return
// 		}

// 		if (res.affectedRows == 0) {
// 			// not found User with the id
// 			result({ kind: 'not_found' }, null)
// 			return
// 		}

// 		logger.debug('Deleted user with id: ', id)
// 		result(null, res)
// 	})
// }

// User.removeAll = result => {
// 	sql.query('DELETE FROM users', (err, res) => {
// 		if (err) {
// 			logger.error('Unable to remove all users: ', err)
// 			result(null, err)
// 			return
// 		}

// 		logger.debug(`Deleted ${res.affectedRows} users`)
// 		result(null, res)
// 	})
// }

module.exports = User
