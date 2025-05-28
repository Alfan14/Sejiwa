//importing modules
import {Sequelize, DataTypes} from 'sequelize';
import userModel from '../models/userModel.mjs'; 
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL

//Database connection with dialect of DATABASEs specifying the database we are using
//port for my database is 5433
//database name is discover

const sequelize = new Sequelize(DATABASE_URL, 
    {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
    },
        define: {
            schema: 'public', 
        }
    }
)

//checking if connection is done
    sequelize.authenticate().then(() => {
        console.log(`Database connected to discover`)
    }).catch((err) => {
        console.log(err)
    })

    const db = {}
    db.Sequelize = Sequelize
    db.sequelize = sequelize

//connecting to model
db.users = userModel(sequelize, DataTypes)

//exporting the module
export default db
