const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const src = 'mongodb+srv://vamsi:Iam1robot@vamsikrishna.g94v9.mongodb.net/';
const destination = 'mongodb+srv://vamsi:Iam1robot@vamsikrishna.g94v9.mongodb.net/';
const srcDatabaseName = 'Vamsi';
const destinationDatabaseName = 'Vamsi2';

const isSameClusterUri = () => {
    return src === destination;
};

const clientSourceRun = async () => {
    try {
        const source = await MongoClient.connect(src, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return source;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return false;
    }
};

let sourceConnection;
if (isSameClusterUri()) {

    clientSourceRun()
        .then((data) => {
            sourceConnection = data;
            getCollectionsName(sourceConnection).then((collections) => {
                sourceCollectionNames = collections;
                migrateToNewDB('test');
            });
        })
        .catch((error) => {
            console.error("Error running clientSourceRun:", error);
        });
}

console.log("Create after-effect");

app.listen(3010, () => console.log('Server started'));

let sourceCollectionNames, destinationCollectionNames;

// if (!isSameClusterUri()) {
//     getCollectionsName(destinationConnection)
//         .then((collections) => {
//             destinationCollectionNames = collections;
//         })
//         .catch((error) => {
//             console.error("Error getting destination collections:", error);
//         });
// }

async function getCollectionsName(connection) {
    return new Promise(async (resolve, reject) => {
        try {
            const collections = await connection.db(srcDatabaseName).listCollections().toArray();
            resolve(collections);
        } catch (error) {
            reject(error);
        }
    });
}

async function migrateToNewDB(collectionName) {
    let tempRecords = await sourceConnection.db(srcDatabaseName).collection(collectionName).find({}).toArray();
    await sourceConnection.db(destinationDatabaseName).collection(collectionName).insertMany(tempRecords)
}
