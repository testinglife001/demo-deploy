const express = require('express')
const router = express.Router()

// import { getGigs } from '../controller/gigController';
// import { getGigs } from '../controller/gigController';

const { getGigs } = require('../controller/gigController')
const { Auth } = require('../middleware/auth')

// import express from "express";
// import {    
//  } from "../controllers/gig.controller.js";
// import { verifyToken } from "../middleware/jwt.js";
// const { Auth } = require('../middleware/auth')
// const router = express.Router();


// router.get('/get-all-blog',getAllBlogs)
router.get("/", getGigs );

// export default router;

module.exports = router