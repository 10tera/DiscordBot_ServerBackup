const {MessageEmbed}=require("discord.js");
const fs=require("fs");
const path = require("path");

module.exports = {
    data : {
        name:"backuplist",
        description:"バックアップデータの一覧を表示します。",
        default_permission:true,
        options:[
        ]
    },
    async execute(interaction,client){
        let configfile;
        try{
            configfile = fs.readFileSync("./config.json", {encoding: "utf8"});
        } catch (err){
            console.error(err);
            const embed = new MessageEmbed()
                .setTitle("設定ファイルを開けませんでした")
                .setColor("RED")
                .setDescription("Cannot open config.json.");
            interaction.reply({embeds:[embed]});
            return;
        }
        let configdata = JSON.parse(configfile);
        let isAdmin = false;
        for(const adminID of configdata.adminIDList){
            if(interaction.user.id === adminID){
                isAdmin = true;
                break;
            }
        }
        if(!isAdmin){
            const embed = new MessageEmbed()
                .setTitle("管理者ではありません")
                .setColor("YELLOW")
                .setDescription("このコマンドは管理者専用コマンドです。");
            interaction.reply({embeds:[embed]});
            return;
        }
        let backupdir;
        try{
            backupdir = fs.readdirSync("./backup",{withFileTypes:true});
        } catch (err){
            console.error(err);
            const embed = new MessageEmbed()
                .setTitle("バックアップフォルダが開けませんでした")
                .setColor("RED")
                .setDescription("Cannot open bakup folder.");
            interaction.reply({embeds:[embed]});
            return;
        }
        const backupfileNames = backupdir.filter(file => file.isFile()).map(c => c.name);
        let returnMessage="";
        for(const name of backupfileNames){
            if(path.extname(name).toLowerCase() === ".json"){
                returnMessage += `・${name.substring(0,name.length-5)}\n`;
            }
        }
        const embed = new MessageEmbed()
            .setTitle("バックアップファイルの一覧")
            .setColor("GREEN")
            .setDescription(returnMessage);
        interaction.reply({embeds:[embed]});
        return;
    }
};