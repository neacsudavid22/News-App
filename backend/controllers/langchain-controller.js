
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { config } from "dotenv";

config();
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  googleApiKey: process.env.GOOGLE_API_KEY,
});

async function generateTags(articleText) {
    const systemTemplate = "Create 5-10 tags for the following article content, return only the words separated by a comma (,)";

    const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{article}"],
    ]);

  const promptValue = await promptTemplate.invoke({ article: articleText });
  const response = await model.invoke(promptValue);

  return response.content;
}

async function generateTitle(articleText) {
  const systemTemplate = "You are an assistant that generates catchy and accurate titles based on article content. Return only the title.";

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{article}"],
  ]);

  const promptValue = await promptTemplate.invoke({ article: articleText });
  const response = await model.invoke(promptValue);

  return response.content;
}


export {
    generateTags,
    generateTitle
}