const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const {getUser} = require('../services/authService')

router.post('/',getUser,candidateController.addCandidate)
router.put('/:candidateID',getUser,candidateController.updateCandidate)
router.delete('/:candidateID',getUser,candidateController.deleteCandidate)

router.get('/candidate',candidateController.showCandidate)
router.get('/vote/count',candidateController.voteCount)

router.post('/vote/:candidateId',getUser,candidateController.addVote)



module.exports = router;