import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({
  apiKey: "AQ.Ab8RN6L9QBPz00s-wip0Y-zvXVh5BUPfoM1-TERIRUuZEtKR1g"
});

const chat = ai.chats.create({
    model: "gemini-3.6-flash",
    history:[],
});


async function main(){
    const userProblme = readlineSync.question("Ask me anything--->");
    const response = await chat.sendMessage({
        message: userProblme,
    });

    console.log(response.text);
    main();
}

main();