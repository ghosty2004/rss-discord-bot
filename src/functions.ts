import { Client, Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import puppeteer from "puppeteer";
import fs from "fs";

import { prefix, urlLocations } from "./constants";
import { playerStats, gangsList, guilds, unBanRequest } from "./interfaces";

let bot : Client;
let browser : puppeteer.Browser;

export async function init(client: Client): Promise<void> {
    bot = client;
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
}

export async function guildLogsChecker(): Promise<void> {
    let lastUnBanRequest = await getLastUnBanRequest();
    setInterval(async() => {
        getLastUnBanRequest().then((value) => {
            if(lastUnBanRequest.linkToPost == value.linkToPost) return;
            lastUnBanRequest = value;
            bot.guilds.cache.filter(f => getGuilds().some(s => s.id == f.id && s.unBanRequestLog != null)).forEach((guild) => {
                let logChannel = guild.channels.cache.get(getGuildVariable(guild, "unBanRequestLog").toString()) as TextChannel;
                const embed = new MessageEmbed();
                embed.setColor("ORANGE");
                embed.setTitle("New Un-Ban Request");
                embed.addField("Player:", lastUnBanRequest.playerName);
                embed.addField("Admin:", lastUnBanRequest.adminName);
                embed.addField("Link to post:", lastUnBanRequest.linkToPost);
                embed.setTimestamp();
                logChannel.send({ embeds: [embed] });
            });
        });
    }, 5000);
}

export function removeEvaluationFailedText(source: string) {
    return source.replace("Evaluation failed: ", "");
}

export function getPlayerStats(name: string): Promise<playerStats> {
    return new Promise(async(resolve, reject) => {
        const page = await browser.newPage();
        if(!page) return reject("Can't connect to rss-ro.com !");
        await page.goto(urlLocations.playerStats.replace("%", name));
        const data = page.evaluate((): Promise<playerStats> => {
            return new Promise((resolve, reject) => {
                const error = document.getElementsByClassName("error")[0] as HTMLDivElement;
                if(error) return reject(`${error.innerText}`);
                else {
                    const table = document.getElementsByClassName("gtop")[1] as HTMLTableElement;
                    const values = [];
                    for(let i = 0; i < table.rows.length; i++) { values.push(table.rows[i].innerText.split("\t")[1]); }
                    return resolve({
                        name: values[0],
                        online: values[1],
                        forumAccount: values[2],
                        VIP: values[3],
                        admin: values[4],
                        money: values[5],
                        coins: values[6],
                        kills: values[7],
                        deaths: values[8],
                        onlineTime: values[9],
                        driftPoints: values[10],
                        racePoints: values[11],
                        stuntPoints: values[12],
                        respect: values[13],
                        properties: values[14],
                        gang: values[15],
                        gems: values[16],
                        statsNote: values[17]
                    });
                }
            });
        });
        data.then((data) => {
            resolve(data);
        }).catch((error) => { 
            reject(removeEvaluationFailedText(error.message)); 
        }).finally(() => {
            page.close();
        });
    });
}

export function getGangsList(): Promise<gangsList[]> {
    return new Promise(async(resolve, reject) => {
        const page = await browser.newPage();
        if(!page) return reject("Can't connect to rss-ro.com !");
        await page.goto(urlLocations.gangsList);
        const data = page.evaluate((): gangsList[] => {
            const table = document.getElementsByClassName("gtop")[0] as HTMLTableElement;
            const values: gangsList[] = [];
            for(let i = 1; i < table.rows.length; i++) { 
                let value = table.rows[i].innerText.split("\t");
                values.push({
                    rank: value[0],
                    name: value[1],
                    points: value[2]
                });
            }
            return values;
        });
        data.then((response) => {
            resolve(response);
        }).finally(() => {
            page.close();
        });
    });
}

export function getLastUnBanRequest(): Promise<unBanRequest> {
    return new Promise(async(resolve, reject) => {
        const page = await browser.newPage();
        if(!page) return reject("Can't connect to rss-ro.com !");
        await page.goto(urlLocations.unBanRequests);
        const data = page.evaluate((): unBanRequest => {
            const table = document.getElementsByClassName("gtop")[0] as HTMLTableElement;
            const value = table.rows[1].innerText.split("\t");
            const link = table.rows[1].getElementsByTagName("a")[0].href;
            return {
                playerName: value[0],
                adminName: value[1],
                linkToPost: link
            }
        });
        data.then((response) => {
            resolve(response);
        }).finally(() => {
            page.close();
        });
    });
}

export function sendSyntax(message: Message, text: string) {
    message.channel.send("```" + "Syntax: " + prefix + text + "```");
}

export function checkGuild(guild: Guild): void {
    const stringData = fs.readFileSync(__dirname + "/guilds.json").toString();
    let data: [guilds] = JSON.parse(stringData);
    if(!data.some(s => s.id == guild.id)) {
        data.push({
            id: guild.id, 
            unBanRequestLog: null
        }); 
        fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(data));
    }
}

export function removeGuild(guildId: string): void {
    const stringData = fs.readFileSync(__dirname + "/guilds.json").toString();
    let data: [guilds] = JSON.parse(stringData);
    let index = data.findIndex(f => f.id == guildId);
    if(index == -1) return;
    data.splice(index, 1);
    fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(data));
}

export function getGuilds(): guilds[] {
    const stringData = fs.readFileSync(__dirname + "/guilds.json").toString();
    let data: guilds[] = JSON.parse(stringData);
    return data;
}

export function editGuildVariable(guild: Guild, variableName: string, value: string | number | boolean): void {
    const stringData = fs.readFileSync(__dirname + "/guilds.json").toString();
    let data: guilds[] = JSON.parse(stringData);
    let result = data.find(f => f.id == guild.id);
    if(!result) return;
    result[variableName] = value; 
    fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(data));
}

export function getGuildVariable(guild: Guild, variableName: string): string | number | boolean {
    const stringData = fs.readFileSync(__dirname + "/guilds.json").toString();
    let data: guilds[] = JSON.parse(stringData);
    let result = data.find(f => f.id == guild.id);
    if(!result) return null;
    if(!result[variableName]) return null;
    return result[variableName];
}