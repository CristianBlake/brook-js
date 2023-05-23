const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provee información sobre el usuario 💀'),
	async execute(interaction) {
		await interaction.reply(`Hola ${interaction.user.username}, te uniste el ${interaction.member.joinedAt} 💀`);
	},
};