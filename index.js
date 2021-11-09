import fetch from "node-fetch";
import parser from "node-html-parser";

run();

async function run() {
    const groups = getGroupsFromArgs()

    const date = new Date()
    const p = n => String(n).padStart(2, '0');
    const dateString = `${p(date.getDate())}.${p(date.getMonth() + 1)}.${p(date.getFullYear())}`

    const url = "https://www.lhv.ee/index/index.cfm?l3=et&id=10182&nocache=1"
    const response = await fetch(url);
    const html = await response.text();

    const parsed = parser.parse(html);
    const table = parsed.querySelector(".data");
    const rows = table.querySelector("tbody");

    const lookForGroups = groups.map(g => '(' + g + ')')
    const teamRows = rows.childNodes.filter((row) => {
        return lookForGroups.some(term => row.toString().includes(term))
    });

    const stringNodes = teamRows.map((row) => {
        return row.structuredText.replace(/\n/g, " ");
    });

    const participants = stringNodes.join("\n");

    const title = `Börsihai edetabel ${dateString} 07:00 — <https://www.lhv.ee/et/hai#edetabel>`;
    console.log(title + '\n```' + participants + '```')
}

function getGroupsFromArgs() {
    const args = process.argv.slice(2)
    if (args.length === 0) {
        console.error("At least one full group name is required!\nExample: yarn start myGroupName")
        process.exit(0)
    }

    return args
}
