const prisma = require('../config/prisma');

class UserDao {
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    async createUser(userData) {
        return await prisma.user.create({ data: userData });
    }

    async updatePassword(email, newPassword) {
        return await prisma.user.update({
            where: { email },
            data: { password: newPassword }
        });
    }
}


module.exports = new UserDao();
