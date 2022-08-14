const {MessageEmbed}=require("discord.js");
const fs=require("fs");

module.exports = {
    data : {
        name:"makebackup",
        description:"バックアップデータを作成します。",
        default_permission:true,
        options:[
            {
                type: 3,
                name: "createname",
                description: "作成するバックアップデータ名を入力してください(一応英数字が望ましいです)",
                required: true
            }
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

        const createfilename = interaction.options.getString("createname");
        if(fs.existsSync(`./backup/${createfilename}.json`)){
            const embed = new MessageEmbed()
                .setTitle("同じ名前のバックアップデータが既に存在しています。")
                .setColor("YELLOW")
                .setDescription("入力したデータ名は既に存在しています。データを削除するか名前を変更してください。");
            interaction.reply({embeds:[embed]});
            return;
        }
        interaction.deferReply();
        
    }
};