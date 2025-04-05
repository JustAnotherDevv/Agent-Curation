const xml2js = require("xml2js");
const he = require("he");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanDescription(htmlText) {
  if (!htmlText) return "";

  let text = htmlText.replace(/<p style="float:right;[^>]*>.*?<\/p>/gs, "");
  text = text.replace(/<[^>]*>/g, " ");
  text = he.decode(text);
  text = text.replace(/\s+/g, " ").trim();

  //   todo - add back later but only for super long articles
  //   if (text.length > 200) {
  //     text = text.substring(0, 200) + "...";
  //   }

  return text;
}

async function getTodaysArticles() {
  try {
    const response = await fetch("https://cointelegraph.com/rss");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
      );
    }

    const xmlData = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);
    const articles = result.rss.channel.item;

    const today = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const todayStr = today
      .toLocaleDateString("en-GB", options)
      .replace(",", "");

    const todayArticles = articles
      .filter((article) => article.pubDate.includes(todayStr))
      .map((article) => ({
        title: article.title,
        link: article.link,
        pubDate: article.pubDate,
        description: cleanDescription(article.description),
        creator: article["dc:creator"],
      }));

    return todayArticles;
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    return [];
  }
}

async function processArticleWithAI(article) {
  try {
    const prompt = `
Article Title: ${article.title}
Article Description: ${article.description}

Task 1: Generate 5-7 relevant tags for this cryptocurrency news article, separated by commas.
Task 2: Write a concise summary of this article in 2-3 sentences.

Format your response exactly as follows:
TAGS: tag1, tag2, tag3, etc.
SUMMARY: Your summary here.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    const tagsMatch = content.match(/TAGS:(.*?)(?=SUMMARY:|$)/s);
    const summaryMatch = content.match(/SUMMARY:(.*?)$/s);

    const tags = tagsMatch
      ? tagsMatch[1]
          .trim()
          .split(",")
          .map((tag) => tag.trim())
      : [];
    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    return {
      title: article.title,
      link: article.link,
      tags,
      summary,
    };
  } catch (error) {
    console.error(
      `Error processing article "${article.title}":`,
      error.message
    );
    return {
      title: article.title,
      link: article.link,
      tags: [],
      summary: "Error generating summary.",
    };
  }
}

async function processAllArticles() {
  try {
    const articles = await getTodaysArticles();
    console.log(`Processing ${articles.length} articles with OpenAI...`);

    const processedArticles = [];
    for (const article of articles) {
      const processed = await processArticleWithAI(article);
      processedArticles.push(processed);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(JSON.stringify(processedArticles, null, 2));
    return processedArticles;
  } catch (error) {
    console.error("Error processing articles:", error.message);
    return [];
  }
}

processAllArticles();
