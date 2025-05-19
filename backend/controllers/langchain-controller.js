
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
    const systemTemplate = "You are an assistant that generates 5 to 10 tags for the following article content, return only the words separated by a comma (,)";

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

async function getInappropriateComments(commentList) {
  const systemTemplate = `You are an assistant that evalues if the content of a comment is inappropriate for a list of comments. 
  Return only the numeric id of the inappropriate comments.
  the response should be in this format: x,y,z, ... where x, y, z are of ObjectId from mongodb format`;

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{comments}"],
  ]);

  let commentListSegment = "";
  let invokeAtTen = 0;
  let finalResponse = [];
  for(const comment of commentList){
    commentListSegment += comment._id + ") " + comment.content + "\n";
    invokeAtTen++;
    if(invokeAtTen === 10){
      const promptValue = await promptTemplate.invoke({ comments: commentListSegment.trim() });
      const response = await model.invoke(promptValue);

      const ids = response.content.split(",").map(id => id.trim()).filter(id => id !== "");

      finalResponse.push(...ids);

      commentListSegment = "";
      invokeAtTen = 0;
    }
  }

  if (invokeAtTen > 0) {
    const promptValue = await promptTemplate.invoke({ comments: commentListSegment.trim() });
    const response = await model.invoke(promptValue);

    const ids = response.content.split(",").map(id => id.trim()).filter(id => id !== "");

    finalResponse.push(...ids);
  }
  console.log(finalResponse)
  return finalResponse;
}


export {
    generateTags,
    generateTitle,
    getInappropriateComments
}