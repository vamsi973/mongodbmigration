const MongoClient = require('mongodb').MongoClient;

// Connection URLs for source and destination MongoDB databases
const sourceUrl = 'mongodb+srv://vamsi:Iam1robot@vamsikrishna.g94v9.mongodb.net/Vamsi';
const destinationUrl = 'mongodb+srv://vamsi:Iam1robot@vamsikrishna.g94v9.mongodb.net/vamsi2';
console.log("hello there")
// Connect to the source and destination MongoDB databases
MongoClient.connect(sourceUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, sourceClient) => {
  console.log("assdalsk")
    if (err) {
        console.error('Error connecting to source MongoDB:', err);
        return;
    }

    MongoClient.connect(destinationUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, destinationClient) => {
        if (err) {
            console.error('Error connecting to destination MongoDB:', err);
            sourceClient.close();
            return;
        }
        console.log("case1")
        const sourceDb = sourceClient.db();
        const destinationDb = destinationClient.db();
        console.log("case2")
        const sourceCollection = sourceDb.collection('test');
        const destinationCollection = destinationDb.collection('test');

        // Retrieve data from the source collection
        sourceCollection.find({}).toArray((err, documents) => {
            console.log("case3")
            console.log(documents, 299)
            if (err) {
                console.error('Error retrieving data from source collection:', err);
                sourceClient.close();
                destinationClient.close();
                return;
            }

            // Apply necessary transformations to each document
            const transformedDocuments = documents.map(transformDocument);

            // Insert the transformed documents into the destination collection
            destinationCollection.insertMany(transformedDocuments, (err, result) => {
                console.log(result, 41)
                if (err) {
                    console.error('Error inserting documents into destination collection:', err);
                } else {
                    console.log('Data migration complete. Documents inserted:', result.insertedCount);
                }

                sourceClient.close();
                destinationClient.close();
            });
        });
    });
});

// Apply necessary transformations to each document
function transformDocument(document) {
    // Apply your necessary transformations here
    // For example, modify or add fields, rename fields, etc.
    // Return the transformed document
    return document;
}
