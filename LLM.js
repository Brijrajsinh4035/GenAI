import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const History = [];

async function Chating(userProblme) {

  History.push(
    {
        role:'user',
        parts:[{text:userProblme}]
    })

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: History
  });

  History.push(
    {
        role:'model',
        parts:[{text:response.text}]
    })
    
  console.log(response.text);
}

async function main(){
    const userProblme = readlineSync.question("Ask me anything--->");
    await Chating(userProblme);
    main();
}

main();
