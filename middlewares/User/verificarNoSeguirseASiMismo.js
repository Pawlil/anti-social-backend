const verificarNoSeguirseASiMismo = (req, res, next) => {
  const { followerId, followedId } = req.params;

  if (Number(followerId) === Number(followedId)) {
    return res.status(400).json({
      message: "No podés seguirte a vos mismo",
    });
  }

  return next();
};

module.exports = verificarNoSeguirseASiMismo;
