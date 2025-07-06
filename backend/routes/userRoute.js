const express = require('express')
const router = express.Router();
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const { authenticateToken } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');


router.get('/checkemail', async (req, res) => {
    const { email } = req.query;

    try {
        const existingUser = await User.findOne({ email });

        res.json({ unique: !existingUser });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Adresa de email exista deja.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(200).json(newUser);  // ✅ Key line
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Eroare la înregistrare.' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (isPasswordMatched) {
                const token = jwt.sign(
                    { id: user._id, email: user.email, isAdmin: user.isAdmin },
                    process.env.JWT_SECRET,
                    { expiresIn: '2h' }
                );


                const currentUser = {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: token
                };

                return res.status(200).json(currentUser);
            } else {
                return res.status(401).json({ message: 'Parola incorecta.' });
            }
        } else {
            return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


router.get("/getallusers", authenticateToken, async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        return res.status(400).json({ message: error });
    }

});

router.post("/deleteuser", authenticateToken, async (req, res) => {

    const userid = req.body.userid

    try {
        await User.findOneAndDelete({ _id: userid })
        res.send('Utilizator sters cu succes!')
    } catch (error) {
        return res.status(400).json({ message: error });
    }

});

router.post("/makeuserpremium", authenticateToken, async (req, res) => {
    const { email } = req.body;

    const sendPremiumConfirmationEmail = async (email) => {
        try {
            const transport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "a7d4eb81509d44",
                    pass: "461945f07d5d15"
                }
            });

            const message = {
                from: 'dinualexandru20@stud.ase.ro',
                to: email,
                subject: 'Activare cont Premium',
                text: 'Felicitări! Acum sunteți un utilizator premium. Vă mulțumim pentru plata de 25 RON.',
            };

            await transport.sendMail(message);
        } catch (error) {
            throw error;
        }
    };


    try {

        await sendPremiumConfirmationEmail(email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost gasit' });
        }

        user.isPremium = true;
        await user.save();

        res.json({ message: 'Utilizatorul a fost marcat ca Premium' });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.post("/loseuserpremium", authenticateToken, async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost gasit' });
        }

        user.isPremium = false;
        await user.save();

        res.json({ message: 'Utilizatorul a pierdut statutul de Premium' });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

module.exports = router