const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret_key');
        res.send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret_key');
        res.send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
};
