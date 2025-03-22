const { Octokit } = require("@octokit/core");
const fs = require("fs/promises");
const path = require("path");
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const convertMarkdown = async (text) => {
  const response = await octokit.request("POST /markdown", {
    text: text,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return response.data;
};

const convertFile = async (name) => {
  const content = await fs.readFile(name, "utf-8");
  const response = await convertMarkdown(content);
  let final = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title></title>
    <link href="css/github-markdown.css" rel="stylesheet" />
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
      }

      @media (max-width: 767px) {
        .markdown-body {
          padding: 15px;
        }
      }
    </style>

    <body class="markdown-body"> 
      ${response}
    </body>
  </head>
`;
  await fs.writeFile(path.basename(name, ".md") + ".html", final);
};

// (async () => {
//   try {
//     let converted = await convertMarkdown("hello **world**");
//     console.log(converted);
//   } catch (error) {
//     console.error("request failed:", error);
//   }
// })();

if (process.argv[2]) {
  const arg = process.argv[2];
  convertFile(arg);
} else {
  console.error("argument not found ");
}
