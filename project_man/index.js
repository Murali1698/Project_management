const express = require('express');
const app = express();
const port = 3000;
//connection to databse
//require mongoose
const mongoose = require('mongoose');

const db = require('./configs/mongoose');
//connecting to managerLogin Schema
const managerlogin = require('./models/managerLogin');
//connecting to memberLogin Schema
const memberlogin = require('./models/memberLogin');
//connecting to task Schema
const task = require('./models/task');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//setting static files
app.use(express.static('assets'));

// Render the login page with both forms
app.get('/', (req, res) => {
    res.render('login');
});


// Define a route to render the "Add Task" page
app.get('/add-task', async (req, res) => {
    res.render('add-task');
});


// Define a route to render the "Add Task" page
app.get('/delete-task', async (req, res) => {
    try {
        const tasks = await task.find(); // Fetch tasks from the database
        res.render('delete-task', { tasks }); // Pass the tasks data to the template
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Error fetching tasks. Please try again later.');
    }
});

// Define a route to render the "Tasks" page
app.get('/tasks', async (req, res) => {
    // Fetch tasks from the database 
    const tasks = await task.find(); 

    // Render the tasks page template with the task data
    res.render('tasks', { tasks });
});


app.post('/delete-task', async (req, res) => {
    const taskId = req.body.taskId;

    try {
        // Delete the task by its ID
        await task.findByIdAndRemove(taskId);

        res.redirect('/delete-task'); // Redirect back to the "delete-task" page after deletion
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle project manager login form submission
app.post('/manager/login', async (req, res) => {
    const managerUsername = req.body.managerUsername;
    const managerPassword = req.body.managerPassword;

    // Query the managerlogin collection for a matching user
    const manager = await managerlogin.findOne({ managerUsername: managerUsername, managerPassword: managerPassword });

    if (manager) {
        res.redirect('/add-task');
    } else {
        res.send('Project manager authentication failed');
    }
});

// Handle project member login form submission
app.post('/member/login', async (req, res) => {
    const memberUsername = req.body.memberUsername;
    const memberPassword = req.body.memberPassword;

    // Query the memberlogin collection for a matching user
    const member = await memberlogin.findOne({ memberUsername: memberUsername, memberPassword: memberPassword });

    if (member) {
        res.redirect('/tasks');
    } else {
        res.send('Project member authentication failed');
    }
});
// Handle task submission, member addition, and task deletion
app.post('/add-task', async (req, res) => {
    const { email, name, tasktype, status, memberEmail, memberPassword } = req.body;

    try {
        // Check if taskIdToDelete is present in the request body
        if (memberEmail && memberPassword) {
            // This is a member addition request
            const newMember = new memberlogin({
                memberUsername: memberEmail,
                memberPassword: memberPassword
            });

            // Save the new member to the database
            await newMember.save();

            // If task details are provided, add the task to the member
            if (email && name && tasktype && status) {
                const newTask = new task({
                    email: memberEmail,
                    name,
                    tasktype,
                    status
                });
                await newTask.save();
            }
        } else {
            // This is a task submission request
            const newTask = new task({
                email,
                name,
                tasktype,
                status
            });

            await newTask.save();
        }

        res.redirect('/tasks'); // Redirect to the home page after task and/or member addition/deletion
    } catch (error) {
        console.error(error);
        res.send('Error handling the request.');
    }
});

app.post('/delete-task', async (req, res) => {
    const taskId = req.body.taskId;

    try {
        // Use Mongoose to delete the task by ID
        await task.findByIdAndRemove(taskId);
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting task' });
    }
});

app.post('/tasks', async (req, res) => {
    const taskId = req.body.taskId;
    const newStatus = 'completed'; // Set the new status here

    try {
        // Find the task by ID and update its status in the database
        const updatedTask = await task.findByIdAndUpdate(taskId, { status: newStatus });
        if (!updatedTask) {
            // Handle the case where the task with the given ID is not found
            console.log("not updated");
        }
        console.log('Task updated successfully:', updatedTask);
        // Redirect back to the task list page or display a message
        res.redirect('/tasks');
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: 'Error updating task status' });
    }
});





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
