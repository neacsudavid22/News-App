import { ChatPromptTemplate } from "@langchain/core/prompts";
import model from "../config/langchain.js";

const generateTags = async (articleText) => {
    const systemTemplate = "You are an assistant that generates 5 to 10 tags for the following article content, return only the words separated by a comma (,)";

    const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{article}"],
    ]);

  const promptValue = await promptTemplate.invoke({ article: articleText });
  const response = await model.invoke(promptValue);

  return response.content;
}

const generateTitle = async (articleText) => {
  const systemTemplate = "You are an assistant that generates catchy and accurate titles based on article content. Return only the title.";

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{article}"],
  ]);

  const promptValue = await promptTemplate.invoke({ article: articleText });
  const response = await model.invoke(promptValue);

  return response.content;
}

const getInappropriateComments = async (commentList) => {
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

  return commentList.filter(c=>finalResponse.includes(c._id))
}

const analyzeDataForChartType = async (chartType, data, interaction = "likes, shares, comments") => {
    const dataJson = JSON.stringify(data, null, 2);
    const systemTemplate = `You are a data engineer that analyzes data coming from a Nivo chart (the chart type is ${chartType}).
    The context is that you analyze data for a web application for a news agency which is testing social media elements in their app.
    The social media element you analyze is: ${interaction}.
    The data is in JSON format.
    Give me only the analysis, limit the text to 1000 characters, but at least 500.
    By analysis I accept also simple observation of the data.
    If you can give a suggestion/recomandation to the news agency`;

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{dataJson}"],
    ]);

    const promptValue = await promptTemplate.invoke({ dataJson });
    const response = await model.invoke(promptValue);

    return response.content;
}

export {
    generateTags,
    generateTitle,
    getInappropriateComments,
    analyzeDataForChartType
}