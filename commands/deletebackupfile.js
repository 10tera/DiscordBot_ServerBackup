const {MessageEmbed}=require("discord.js");
const fs=require("fs");

module.exports = {
    data: {
        name:"deletebackupfile",
        description:"バックアップデータを削除します",
        default_permission:true,
        options:[
            {
                type: 3,
                name: "backupname",
                description: "削除したいバックアップファイル名を入力してください。/backuplistで一覧を取得できます。",
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
        
        const deletefilename = interaction.options.getString("backupname");
        if(!fs.existsSync(`./backup/${deletefilename}.json`)){
            const embed = new MessageEmbed()
                .setTitle("バックアップファイルが存在しません")
                .setColor("YELLOW")
                .setDescription("入力したバックアップファイルが存在しません。再度入力をご確認ください。");
            interaction.reply({embeds:[embed]});
            return;
        }
        fs.rm(`./backup/${deletefilename}.json`,(err) => {
            if(err){
                console.error(err);
                const embed = new MessageEmbed()
                    .setTitle("データを削除できませんでした")
                    .setColor("RED")
                    .setDescription("入力したバックアップデータを削除できませんでした。");
                interaction.reply({embeds:[embed]});
                return;
            } else{
                const embed = new MessageEmbed()
                    .setTitle("データを削除しました")
                    .setColor("GREEN")
                    .setDescription("入力したバックアップデータを削除しました。");
                interaction.reply({embeds:[embed]});
            }
        });
        return;
    }
}