const { MongoClient } = require("mongodb");

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI environment variable is not set.");
    process.exit(1);
  }
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const products = db.collection("products");
  // Use aggregation pipeline update for trimming and lowercasing
  const result = await products.updateMany({}, [
    {
      $set: {
        category: {
          $toLower: { $trim: { input: "$category" } },
        },
      },
    },
  ]);
  console.log("Updated categories:", result.modifiedCount);
  await client.close();
})();
