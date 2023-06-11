import express, {Request, Response, NextFunction} from "express";
import cookieParser from "cookie-parser";
import path from 'path';
import bcrypt from "bcrypt";
import db from "./models";
import Todo from "./models/todo";
import User from "./models/user";

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser("ThisIReallySecret!!"))

let tasdks: {
    id: number,
    name: string,
    importance: number,
    urgence: number,
    done: boolean
}[] = [];

export default function generateRandomString(len: number) :string {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.!^';
    let token = '';
    for (let i = 0; i < len; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}

async function checkDatabaseConnection() {
    try {
        await db.authenticate();
        await db.sync({ force: false });
        console.log("Logged to the client database")
    } catch (e) {
        console.error("Error when connection to the database")
        console.error(e)
        process.exit(1)
    }
}

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies as any;
    if (!token) {
        return res.status(401).send({
            message: "Not logged in."
        });
    }
    const user = await User.findOne({
        where: {
            lastAuthToken: token
        }
    });
    if (!user) {
        return res.status(401).send({
            message: "Bad token."
        })
    }
    (req as any).user = user;
    return next();
}

const checkAuthRedirect = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies as any;
    if (!token) {
        return res.status(401).send({
            message: "Not logged in."
        });
    }
    const user = await User.findOne({
        where: {
            lastAuthToken: token
        }
    });
    if (!user) {
        return res.render('partials/page', {
            title: "Login",
            view: '../login',
        });
    }
    return next();
}

app.get('/', (req, res) => {
    res.render('partials/page', {
        title: "Login",
        view: '../login',
    });
})

app.get('/dashboard', checkAuthRedirect, async (req, res) => {
    const todayDate = new Date();
    const tomorowDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    tomorowDate.setHours(0, 0, 0, 0);
    tomorowDate.setDate(tomorowDate.getDate() + 1);
    const tasks = await Todo.findAll();
    const tasksNotDones = tasks.filter(x => x.doneAt == null || (x.doneAt > todayDate && x.doneAt < tomorowDate));
    const toDayTasks = tasksNotDones.sort((a, b) => (b.urgence * ((b.importance / 100) + 1)) - (a.urgence * ((a.importance / 100) + 1))).slice(0, 5);
    res.render('partials/page', {
        title: "Dashboard",
        view: '../dashboard',
        tasks: tasksNotDones,
        toDayTasks: toDayTasks
    })
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).send({
            message: "Invalid body."
        });
    }
    const user = await User.findOne({
        where: {
            username: username
        }
    });
    if (!user) {
        return res.status(401).send({
            message: "Bad credentials."
        });
    }
    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({
            message: "Bad credentials."
        })
    }
    const token = generateRandomString(48);
    await user.update({
        lastAuthToken: token
    });
    res.cookie("token", token);
    return res.status(200).send({
        message: "Success."
    });
})

app.post("/checkLog", checkAuth, (req, res) => {
    return res.status(200).send({
        message: "Success."
    })
})

app.post("/validateTodo", checkAuth, async (req, res) => {
    const {taskId} = req.body;
    const task = await Todo.findOne({
        where: {
            id: taskId,
            userId: (req as any).user.id
        }
    });
    if (!taskId) {
        return res.status(400).send({
            message: "Invalid body."
        })
    }
    if (!task) {
        return res.status(400).send({
            message: "Invalid task id."
        })
    }
    task.done = !task.done;
    task.doneAt = new Date();
    await task.save();
    return res.status(200).send({
        message: "Success."
    })
})

app.post("/deleteTodo", checkAuth, async (req, res) => {
    const {taskId} = req.body;
    const task = await Todo.findOne({
        where: {
            id: taskId,
            userId: (req as any).user.id
        }
    });
    if (!taskId) {
        return res.status(400).send({
            message: "Invalid body."
        })
    }
    if (!task) {
        return res.status(400).send({
            message: "Invalid task id."
        })
    }
    await task.destroy();
    return res.status(200).send({
        message: "Success."
    })
})

app.post("/createTodo", checkAuth, async (req, res) => {
    const {taskName} = req.body;
    if (!taskName) {
        return res.status(400).send({
            message: "Invalid body."
        })
    }
    const todo = await Todo.create({
        name: taskName,
        importance: 50,
        urgence: 50,
        done: false
    })
    await todo.$set('userId', (req as any).user.id);
    return res.status(200).send({
        message: "Success."
    })
})

app.post("/createUser", async (req, res) => {
    const { username, password, apiKey } = req.body;
    if (!username || !password || apiKey != process.env.API_KEY || !apiKey) {
        return res.status(400).send({
            message: "Malformed."
        })
    }
    let user = await User.findOne({
        where: {
            username: username
        }
    });
    if (user) {
        return res.status(400).send({
            message: "Already exists."
        });
    }
    user = await User.create({
        username: username,
        password: await bcrypt.hash(password, 10)
    });
    return res.status(200).send({
        message: "Ok"
    });
})

app.post("/updateEisen", checkAuth, async (req, res) => {
    const {taskId, importance, urgence} = req.body;
    const task = await Todo.findOne({
        where: {
            id: taskId,
            userId: (req as any).user.id
        }
    });
    if (!taskId || !importance || !urgence) {
        return res.status(400).send({
            message: "Invalid body."
        })
    }
    const importanceInt = parseInt(importance);
    const urgenceInt = parseInt(urgence);
    if (!task) {
        return res.status(400).send({
            message: "Invalid task id."
        })
    }
    if (isNaN(importanceInt) || isNaN(urgenceInt)) {
        return res.status(400).send({
            message: "Invalid numbers."
        })
    }
    task.importance = importanceInt;
    task.urgence = urgenceInt;
    await task.save();
    return res.status(200).send({
        message: "Success."
    })
})

app.use('*', (req, res) => {
    return res.status(404).send({
        message: "Not found."
    });
})

export { app, checkDatabaseConnection };