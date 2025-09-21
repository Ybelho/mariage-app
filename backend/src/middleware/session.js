const { randomUUID } = require("crypto");

module.exports = function session() {
  return (req, res, next) => {
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/(?:^|;\s*)sid=([^;]+)/);
    let sid = match?.[1];

    if (!sid) {
      sid = randomUUID();
      // même site en local → Lax, HttpOnly
      res.setHeader(
        "Set-Cookie",
        `sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
      );
    }

    req.sessionId = sid;
    next();
  };
};
