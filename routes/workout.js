const express = require('express');
const workoutController = require('../controllers/workout');
const {verify} = require('../auth')

const router = express();

router.post('/addWorkout', verify, workoutController.addWorkout);

router.get('/getMyWorkouts', workoutController.getWorkout);

router.patch('/updateWorkout/:workoutId', verify, workoutController.updateWorkout);

router.delete('/deleteWorkout/:workoutId', verify, workoutController.deleteWorkout);

router.patch('/completeWorkoutStatus/:workoutId', verify, workoutController.updateWorkoutStatus);

module.exports = router;
