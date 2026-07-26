import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const History = [];

async function Instructor(userProblme) {

  History.push({
     role:'user',
     parts:[{text:userProblme}]
  });

  const interaction = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: History,
    system_instruction: `You are DSA Instructor. You will only reply to the problem related to Data structure And Algorithm,Give answer in easy way prosible with one exmaple.
                         You don't give any other Problem answer that is not related to DSA. If user ask any other problem then give him negetive and anger reply to the ask only dsa related problem hear.
                         
                         you problem answer should not to be big explaination,it in sort expaintion reposted.`,
  });

  History.push({
    role:'model',
    parts:[{text:interaction.text}]
  });

  console.log(interaction.text);
}

async function main() {
  const userProblme = readlineSync.question("Ask Me Anything Releted To DSA --->");
  await Instructor(userProblme);
  main();
}

main();