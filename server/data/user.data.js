var User = require('./../models/user.model');

module.exports = {
  createUser: async (userData) => {
    const userObj = await User.findOne({ author_email: userData.author_email });
    console.log('userObj',userObj)
    if (userObj) {
      return userObj;
    }
    let newUser = new User(userData);
    console.log('new User',newUser)

    return await newUser.save();
  },

  getAllUsers: () => {
    return User.find({});
  },
};
