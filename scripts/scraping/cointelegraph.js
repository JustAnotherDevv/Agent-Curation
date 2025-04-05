const xml2js = require("xml2js");
const he = require("he");

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

    console.log(JSON.stringify(todayArticles, null, 2));
    console.log(
      `Total articles published today (${todayStr}): ${todayArticles.length}`
    );

    return todayArticles;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
getTodaysArticles();
