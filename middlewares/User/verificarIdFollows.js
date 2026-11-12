const verificarIdFollow = (req, res, next) => {
  const { followerId, followedId } = req.params;
  const FollowedIdNumber = Number(followedId);
  const FollowerIdNumber = Number(followerId);
  if (
    !followerId ||
    !Number.isInteger(FollowerIdNumber) ||
    FollowerIdNumber <= 0
  ) {
    return res.status(400).json({
      message: "La ID del seguidor debe ser un entero positivo",
    });
  }
  if (
    !followedId ||
    !Number.isInteger(FollowedIdNumber) ||
    FollowedIdNumber <= 0
  ) {
    return res.status(400).json({
      message: "La ID del seguido debe ser un entero positivo",
    });
  }
  return next();
};

module.exports = verificarIdFollow;
