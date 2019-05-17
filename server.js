const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt"); // Validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keys from a JSON Web Key set (JWKS) endpoint

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ["RS256"]
});

const app = express();

const videos = [
  {
    id: "9hJ8lLNWrM4",
    title: "Pure Water",
    genre: "Documentary",
    type: "movie"
  },
  { id: "JTMVOzPPtiw", title: "Nookie", genre: "Action", type: "show" },
  { id: "Gs069dndIYk", title: "September", genre: "Comedy", type: "show" },
  {
    id: "HgzGwKwLmgM",
    title: "Don't Stop Me Now",
    genre: "Action",
    type: "movie"
  },
  {
    id: "hTWKbfoikeg",
    title: "Smells Like Teen Spirit",
    genre: "Documentary",
    type: "movie"
  }
];

app.get("/public", function(req, res) {
  res.json({
    videos
  });
});

app.get("/search", function(req, res) {
  // remove apostrophes
  let query = req.query.q.toLowerCase().replace(/'/, "");

  const filteredVideos = videos.filter(
    video =>
      video.genre
        .toLowerCase()
        .replace(/'/, "")
        .includes(query) ||
      video.title
        .toLowerCase()
        .replace(/'/, "")
        .includes(query)
  );
  res.json({
    videos: filteredVideos,
    query: query
  });
});

app.get("/private", checkJwt, function(req, res) {
  res.json({
    message: "Hello from a private API!"
  });
});

app.listen(3001);
console.log("API server listening on " + process.env.REACT_APP_AUTH0_AUDIENCE);
