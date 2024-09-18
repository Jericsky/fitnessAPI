const Workout = require('../models/Workout');

module.exports.addWorkout = async (req, res) => {
    try {
        const { name, duration } = req.body;
        const { id } = req.user;

        if (!name || !duration) {
            return res.status(400).send({
                error: 'Validation error',
                message: 'Name and duration are required'
            });
        }

        let newWorkout = new Workout({
            name: name,
            duration: duration,
            userId: id 
        });

        await newWorkout.save()
            .then((result) => {
                console.log(result);
                return res.status(201).send({ newWorkout: result });
            })
            .catch(error => {
                console.error('Error saving workout:', error);
                return res.status(500).send({ error: 'Internal server error' });
            });
    } catch (error) {
        console.log('Error for creating new workout: ', error);
        return res.status(500).send({ error: 'Internal server error: Error for creating workout' });
    }
};

module.exports.getWorkout = async(req, res) => {
    try {
        return await Workout.find({})
        .then((result) => {
            console.log(result)

            if(result.length > 0){
                return res.status(200).send({workouts: result})
            } else {
                return res.status(404).send({message: 'No workouts found'})
            }
        })
        
    } catch (error) {
        console.log('Error for getting workouts: ', error)
        return res.status(500).send({error: 'Internal server error: Error for getting workout'});
    }
}

module.exports.updateWorkout = async (req, res) => {
    try {

        const {name, duration} = req.body;
        const {workoutId} = req.params;

        if(!name || !duration){
            return res.status(400).send({error: 'Name and duration are required'})
        }

        if (!workoutId){
            return res.status(400).send({error: 'Workout ID is required'})
        }

        const updatedWorkout = {name, duration}

        const result = await Workout.findByIdAndUpdate(workoutId, updatedWorkout, {new: true});

        if(!result){
            return res.status(404).send({error: 'Workout not found'})
        }

        return res.status(200).send(
            {message: 'Workout updated successfully'},
            {updatedWorkout: result}
        )

    } catch (error) {
        console.log('Error in updating workout: ', error);
        return res.status(500).send({error: 'Internal server error: Error for updating workout'})
    }
}

module.exports.updateWorkout = async (req, res) => {
    try {
        const { name, duration } = req.body;
        const { workoutId } = req.params;

        if (!name || !duration) {
            return res.status(400).send({ error: 'Name and duration are required' });
        }

        if (!workoutId) {
            return res.status(400).send({ error: 'Workout ID is required' });
        }

        const updatedWorkout = { name, duration };

        const result = await Workout.findByIdAndUpdate(workoutId, updatedWorkout, { new: true });

        if (!result) {
            return res.status(404).send({ error: 'Workout not found' });
        }

        return res.status(200).send(result);

    } catch (error) {
        console.log('Error in updating workout: ', error);
        return res.status(500).send({ error: 'Internal server error: Error for updating workout' });
    }
}


module.exports.deleteWorkout = async (req, res) => {
    try {

        const {workoutId} = req.params;

        if(!workoutId){
            return res.status(404).send({error: 'Workout id is required'})
        }

        const workout = await Workout.findByIdAndDelete(workoutId);

        if(!workout){
            return res.status(404).send({error: 'Workout not found'})
        }
        
        return res.status(200).send({message: 'Workout deleted successfully'})

    } catch (error) {
        console.log('Error in deleting workout: ', error);
        return res.status(500).send({error: 'Internal server error: Error for deleting workout'})
    }
}

module.exports.updateWorkoutStatus = async (req, res) => {
    try {

        const {workoutId} = req.params;

        if(!workoutId){
            return res.status(404).send({error: 'Workout id is required'})
        }

        const result = await Workout.findOne({_id: workoutId});
        if (!result){
            return res.status(404).send({error: 'Workout not found'})
        }

        if(result.status === 'completed'){
            return res.status(200).send({message: 'Workout status already completed'})
        }

        result.status = 'completed'
        
        await result.save();

        res.status(200).send({
            message: 'Workout status updated successfully',
            updatedWorkout: result
        })
        
    } catch (error) {
        
    }
}