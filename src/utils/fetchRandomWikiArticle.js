import { convertJsonToArray } from "./convertJsonToArray";
import { parseQuery } from "./parseQuery";
import { parseWikiText } from "./parseWikiText";
import { getSentencesFromText } from "./getSentencesFromText";

export const fetchRandomWikiArticle = async (locale = "en") => {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const wikiUrl = "https://" + locale + ".wikipedia.org/w/api.php?";

  let query = parseQuery({
    format: "json",
    action: "query",
    generator: "random",
    grnnamespace: "0",
    prop: "pageimages|extracts",
    piprop: "original",
    exlimit: "max",
    explaintext: "1"
  });

  let request = proxyUrl + wikiUrl + query;

  const response = await fetch(request, {
    method: "GET",
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: null
  });
  const data = await response.json();

  const page = convertJsonToArray(data.query.pages)[0];
  const pageArray = convertJsonToArray(page);

  let hasImg = pageArray.length === 5 ? true : false;
  page["hasImg"] = hasImg;

  page["text"] = parseWikiText(page.extract);
  page["brief"] = getSentencesFromText(page.text, 2);
  page["image"] = page.hasImg ? page.original.source : "";
  page["link"] = "https://en.wikipedia.org/wiki/" + page.title;
  page["locale"] = locale;

  delete page.original;
  delete page.pageid;
  delete page.hasImg;
  delete page.ns;

  return page;
};
