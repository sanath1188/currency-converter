let router = require("express").Router();

let User = require('../../models/user');
const bcrypt = require("bcrypt");
var passport   = require("../../config/passport");

/** Registration route */
router.post('/register', async (req, res) => {
  const { name, user_name, email, password } = req.body;
  let error = null;

  if (!name || !email || !password) {
    error = "Please fill in all fields!";
  }

  if (password.length < 6) {
    error = 'Password must be at least 6 characters long!'
  }

  if (error) {
    res.status(404).json({
      data: error
    })

    return;
  } else {
    let user = await User.findOne({
      where: {
        email: email.toString()
      }
    });

    if (user) {
      console.log("error")
      error = 'Email already registered!';
      res.status(404).json({
        data: error
      })
    } else {
      const newUser = {
        name: name,
        user_name: user_name,
        email: email,
        password: password
      };

      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt,
          async (err, hash) => {
            if (err) throw err;

            newUser.hash = hash;
            let user = await User.create(newUser);

            res.status(200).json({
              data: user
            })
          }
        )
      );
    }
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
		if (err) { // Authentication error.
			return next(err);
		}

		if (!user) {
			return res.redirect("/dashboard/login/failed");
		}

		console.log("logging user: " + user.name + " in...");

    req.login(user, function (err) { // Valid user./**/
      console.log("heck yeah")
			if (err) { // Login error.
				return next(err);
			}

			res.status(200).send({
        data: user
      })
		});
	})(req, res, next);
})

router.get("/test", (req, res) => {
  if(req.user) {
    res.status(200).json({
      data: req.user
    })
  } else {
    res.status(404).json({
      data: "User ded"
    });
  }
})

module.exports = router;