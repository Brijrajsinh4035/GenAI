import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

const History = [];

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function sum({ num1, num2 }) {
  return num1 + num2;
}

function prime({ num }) {
  if (num < 2) {
    return false;
  }
  for (let i = 2; i < Math.sqrt(num); i++) {
    if (num % i == 0) {
      return false;
    }
  }
  return true;
}

async function getCriptoPrice({ coin }) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`,
  );
  const data = await response.json();

  return data;
}

const sumDeclaration = {
  name: "sum",
  description:
    "this function takes 2 numbers as input and give its sum return.",
  parameters: {
    type: "object",
    properties: {
      num1: {
        type: "number",
        description: "it will be first number for addtion ex: 10",
      },
      num2: {
        type: "number",
        description: "it will be second number for addtion ex : 30",
      },
    },
    required: ["num1", "num2"],
  },
};

const primedeclaration = {
  name: "prime",
  description:
    "this function takes one argument and return number is prime or not prime",
  parameters: {
    type: "object",
    properties: {
      num: {
        type: "number",
        description: "it will be number that can be prime or not prime ex: 13",
      },
    },
    required: ["num"],
  },
};

const cryptodeclaration = {
  name: "getCriptoPrice",
  description: "get the current price of any crypto currency like bitcoin",
  parameters: {
    type: "object",
    properties: {
      coin: {
        type: "String",
        description: "this is crypto currency name ex : bitcoin",
      },
    },
    required: ["coin"],
  },
};

const availabletools = {
  sum: sum,
  prime: prime,
  getCriptoPrice: getCriptoPrice,
};

async function runAgent(userProblme) {
  History.push({
    role: "user",
    parts: [{ text: userProblme }],
  });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: History,
      system_instruction: `You are DSA Instructor. You will only reply to the problem related to Data structure And Algorithm,Give answer in easy way prosible with one exmaple.
                         You don't give any other Problem answer that is not related to DSA. If user ask any other problem then give him negetive and anger reply to the ask only dsa related problem hear.
                         
                         you problem answer should not to be big explaination,it in sort expaintion reposted.`,
      config: {
        tools: [
          {
            functionDeclarations: [
              sumDeclaration,
              primedeclaration,
              cryptodeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const { name, args } = response.functionCalls[0];
      const funcall = availabletools[name];
      const result = await funcall(args);

      const functionResponsePart = {
        name: name,
        response: {
          result: result,
        },
      };

      History.push(response.candidates[0].content);

      History.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      History.push({
        role: "model",
        parts: [{ text: response.text }],
      });

      console.log(response.text);
      return;
    }
  }
}

async function main() {
  const userProblme = readlineSync.question(
    "Ask Me Anything--->",
  );
  await runAgent(userProblme);
  main();
}

main();
