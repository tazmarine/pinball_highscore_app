const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamo = new DynamoDBClient();

exports.handler = async (event) => {
  const machine = event.queryStringParameters?.machine_name;
  if (!machine) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing machine_name parameter" })
    };
  }
  const params = {
    TableName: "PinballHighScores",
    KeyConditionExpression: "machine_name = :m",
    ExpressionAttributeValues: {
      ":m": { S: machine }
    },
    ScanIndexForward: false,
    Limit: 10
  };
  const command = new QueryCommand(params);
  const result = await dynamo.send(command);
  const items = result.Items?.map(item => ({
    machine_name: item.machine_name.S,
    player: item.player.S,
    score: Number(item.score.N)
  })) || [];
  return {
    statusCode: 200,
    body: JSON.stringify(items)
  };
};